import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3001);
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";

const loadEnv = () => {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = valueParts.join("=").trim();
  }
};

loadEnv();

if ((!process.env.MPESA_CALLBACK_URL || process.env.MPESA_CALLBACK_URL.includes("example.com")) && process.env.RENDER_EXTERNAL_HOSTNAME) {
  process.env.MPESA_CALLBACK_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/api/mpesa-callback`;
}

const requiredMpesaEnv = [
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_SHORTCODE",
  "MPESA_PASSKEY",
  "MPESA_CALLBACK_URL",
];

const hasMpesaConfig = () =>
  requiredMpesaEnv.every(key => {
    const value = process.env[key];
    return value && !value.startsWith("your_") && !value.includes("example.com");
  });

const hasSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && !url.includes("your-project-ref") && !key.startsWith("your_"));
};

const saveToSupabase = async (table, payload) => {
  if (!hasSupabaseConfig()) return null;

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`Supabase insert failed for ${table}:`, detail);
    return null;
  }

  const data = await response.json();
  return data?.[0] || null;
};

const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return "";
};

const timestamp = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
};

const mpesaBaseUrl = () =>
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(JSON.stringify(payload));
};

const readJson = (req) => new Promise((resolve, reject) => {
  let body = "";
  req.on("data", chunk => {
    body += chunk;
    if (body.length > 1_000_000) req.destroy();
  });
  req.on("end", () => {
    try {
      resolve(body ? JSON.parse(body) : {});
    } catch (error) {
      reject(new Error("Invalid JSON body."));
    }
  });
});

const getAccessToken = async () => {
  const credentials = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const response = await fetch(`${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`M-Pesa auth failed: ${detail}`);
  }

  const data = await response.json();
  return data.access_token;
};

const handleStkPush = async (req, res) => {
  try {
    const body = await readJson(req);
    const phone = normalizePhone(body.phone);
    const amount = Math.max(1, Math.round(Number(body.amount || 0)));
    const item = String(body.item || "Diani Experience booking").slice(0, 40);
    const guests = Math.max(1, Math.round(Number(body.guests || 1)));
    const bookingDate = body.date || null;
    const category = body.category || null;

    if (!phone) return sendJson(res, 400, { ok: false, message: "Enter a valid Kenyan phone number." });
    if (!amount) return sendJson(res, 400, { ok: false, message: "Invalid payment amount." });

    if (!hasMpesaConfig()) {
      await saveToSupabase("bookings", {
        item,
        category,
        booking_date: bookingDate,
        guests,
        phone,
        amount,
        payment_status: "mpesa_setup_required",
      });

      return sendJson(res, 501, {
        ok: false,
        setupRequired: true,
        message: "M-Pesa credentials are not configured yet. Copy .env.example to .env, fill it in, then restart npm run dev.",
      });
    }

    const token = await getAccessToken();
    const time = timestamp();
    const shortcode = process.env.MPESA_SHORTCODE;
    const password = Buffer.from(`${shortcode}${process.env.MPESA_PASSKEY}${time}`).toString("base64");

    const response = await fetch(`${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: time,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: item,
        TransactionDesc: `Booking payment for ${item}`,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.ResponseCode !== "0") {
      await saveToSupabase("bookings", {
        item,
        category,
        booking_date: bookingDate,
        guests,
        phone,
        amount,
        payment_status: "stk_failed",
        mpesa_response: data,
      });

      return sendJson(res, 400, { ok: false, message: data.errorMessage || data.ResponseDescription || "STK push failed.", data });
    }

    const booking = await saveToSupabase("bookings", {
      item,
      category,
      booking_date: bookingDate,
      guests,
      phone,
      amount,
      payment_status: "stk_sent",
      merchant_request_id: data.MerchantRequestID,
      checkout_request_id: data.CheckoutRequestID,
      mpesa_response: data,
    });

    return sendJson(res, 200, { ok: true, message: "STK push sent. Ask the customer to enter their M-Pesa PIN.", data });
  } catch (error) {
    return sendJson(res, 500, { ok: false, message: error.message || "Payment request failed." });
  }
};

const handleEnquiry = async (req, res) => {
  try {
    const body = await readJson(req);
    const enquiry = await saveToSupabase("enquiries", {
      channel: body.channel || "website",
      subject: body.subject || null,
      message: body.message || null,
      item: body.item || null,
      email: body.email || null,
      phone: body.phone || null,
    });

    return sendJson(res, 200, {
      ok: true,
      saved: Boolean(enquiry),
      message: enquiry ? "Enquiry saved." : "Enquiry action opened. Add Supabase credentials to save it in the database.",
    });
  } catch (error) {
    return sendJson(res, 500, { ok: false, message: error.message || "Enquiry could not be saved." });
  }
};

const serveStatic = (req, res) => {
  const distPath = path.join(__dirname, "dist");
  const requestPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const filePath = requestPath === "/" ? path.join(distPath, "index.html") : path.join(distPath, requestPath);
  const safePath = filePath.startsWith(distPath) && fs.existsSync(filePath) ? filePath : path.join(distPath, "index.html");

  if (!fs.existsSync(safePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Build not found. Run npm run build first.");
    return;
  }

  const ext = path.extname(safePath);
  const contentType = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  }[ext] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(safePath).pipe(res);
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });

  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  if (req.method === "POST" && pathname === "/api/stk-push") return handleStkPush(req, res);
  if (req.method === "POST" && pathname === "/api/enquiries") return handleEnquiry(req, res);
  if (req.method === "POST" && pathname === "/api/mpesa-callback") {
    const body = await readJson(req).catch(() => ({}));
    console.log("M-Pesa callback:", JSON.stringify(body, null, 2));
    return sendJson(res, 200, { ResultCode: 0, ResultDesc: "Accepted" });
  }

  return serveStatic(req, res);
});

server.listen(port, host, () => {
  console.log(`API server running on http://${host}:${port}`);
});
