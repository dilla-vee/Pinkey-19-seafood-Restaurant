import { useState, useEffect, useRef, useMemo } from "react";

const COLORS = {
  sand: "#F5E6C8",
  coral: "#FF6B35",
  ocean: "#0A7EA4",
  deep: "#042B3D",
  teal: "#1ABCB0",
  gold: "#D4A843",
  white: "#FDFCFA",
  glass: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.15)",
};

const NAV_LINKS = ["Explore","Restaurants","Experiences","Hotels","Transport","About","Contact"];
const WHATSAPP_NUMBER = "254797373482";
const CONTACT_EMAIL = "dillabeauquinn@gmail.com";

const CATEGORIES = [
  { icon: "🍽️", label: "Restaurants", count: "48 spots", color: "#FF6B35" },
  { icon: "🤿", label: "Water Sports", count: "22 activities", color: "#1ABCB0" },
  { icon: "🏨", label: "Accommodation", count: "63 stays", color: "#0A7EA4" },
  { icon: "🚤", label: "Tours & Boats", count: "35 tours", color: "#D4A843" },
  { icon: "🌙", label: "Nightlife", count: "14 venues", color: "#7B2FBE" },
  { icon: "🚖", label: "Transport", count: "30 services", color: "#2ECC71" },
];

const saveEnquiry = async (payload) => {
  try {
    await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("Could not save enquiry", error);
  }
};

const RESTAURANTS = [
  {
    name: "Sails Beach Bar",
    cuisine: "Seafood & Grill",
    rating: 4.9,
    reviews: 312,
    price: "KES 800–2,500",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    tags: ["Beachfront", "Sundowner", "Seafood"],
    open: "12pm – 11pm",
  },
  {
    name: "Ali Barbour's Cave",
    cuisine: "Fine Dining",
    rating: 4.8,
    reviews: 276,
    price: "KES 2,000–6,000",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    tags: ["Romantic", "Cave Dining", "Gourmet"],
    open: "6pm – 12am",
  },
  {
    name: "Nomad Beach Bar",
    cuisine: "International & Swahili",
    rating: 4.7,
    reviews: 198,
    price: "KES 600–1,800",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    tags: ["Casual", "Pool", "Live Music"],
    open: "8am – 10pm",
  },
];

const EXPERIENCES = [
  { name: "Dolphin Watching Tour", duration: "3 hours", price: "KES 3,500", rating: 4.9, icon: "🐬", image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80", tag: "Most Popular" },
  { name: "Snorkeling at Wasini", duration: "Full Day", price: "KES 5,000", rating: 4.8, icon: "🤿", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", tag: "Top Rated" },
  { name: "Quad Biking Safari", duration: "2 hours", price: "KES 2,800", rating: 4.7, icon: "🏍️", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", tag: "Adventure" },
  { name: "Sunset Dhow Cruise", duration: "2.5 hours", price: "KES 4,200", rating: 5.0, icon: "⛵", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", tag: "Romantic" },
  { name: "Kitesurfing Lessons", duration: "4 hours", price: "KES 6,500", rating: 4.9, icon: "🪁", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", tag: "Thrill" },
  { name: "Colobus Forest Walk", duration: "1.5 hours", price: "KES 1,200", rating: 4.6, icon: "🐒", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", tag: "Nature" },
];

const HOTELS = [
  {
    name: "Baobab Beach Resort",
    type: "5★ Resort",
    price: "KES 18,500",
    rating: 4.9,
    reviews: 542,
    amenities: ["🏊 Pool","🏖️ Beach","🍽️ Restaurant","💆 Spa"],
    image: "https://images.unsplash.com/photo-1582610116397-edb72278f9f8?w=600&q=80",
  },
  {
    name: "Diani Sea Resort",
    type: "4★ Hotel",
    price: "KES 9,800",
    rating: 4.7,
    reviews: 318,
    amenities: ["🏊 Pool","🌊 Ocean View","🚿 Snorkeling","🅿️ Parking"],
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
  },
  {
    name: "Kisiwa Villa",
    type: "Luxury Villa",
    price: "KES 28,000",
    rating: 5.0,
    reviews: 87,
    amenities: ["🏠 Private","🌴 Garden","👨‍🍳 Chef","🚗 Driver"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
  },
];

const TESTIMONIALS = [
  { name: "Sophie Laurent", country: "🇫🇷 France", text: "Diani is pure paradise. The dolphin tour at sunrise was the highlight of my entire Africa trip. The platform made booking incredibly seamless!", avatar: "https://i.pravatar.cc/80?img=47", rating: 5 },
  { name: "James Odhiambo", country: "🇰🇪 Kenya", text: "As a local, I'm impressed by how well this platform showcases the best of Diani. Booked Ali Barbour's Cave for my anniversary — unforgettable!", avatar: "https://i.pravatar.cc/80?img=12", rating: 5 },
  { name: "Priya Sharma", country: "🇮🇳 India", text: "The kitesurfing lessons were beyond my expectations. The instructor was world class and the whole experience was organized perfectly through the app.", avatar: "https://i.pravatar.cc/80?img=29", rating: 5 },
  { name: "Marco Bianchi", country: "🇮🇹 Italy", text: "Stayed at Baobab Beach Resort — booked through here in minutes. The villa was stunning and worth every shilling. Will be back!", avatar: "https://i.pravatar.cc/80?img=55", rating: 5 },
];

const TRANSPORT = [
  { icon: "✈️", name: "Airport Transfers", desc: "Mombasa Moi Airport to Diani, door-to-door comfort", price: "From KES 2,500" },
  { icon: "🛺", name: "Tuk-Tuk Services", desc: "Hop around Diani Beach Road in style", price: "From KES 200" },
  { icon: "🚗", name: "Private Drivers", desc: "Full day hire, AC vehicles, English-speaking drivers", price: "From KES 4,500" },
  { icon: "🏍️", name: "Boda Boda", desc: "Quick local hops, beach to beach", price: "From KES 100" },
];

function StarRating({ rating, size = 14 }) {
  return (
    <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? "#D4A843" : "#555" }}>★</span>
      ))}
    </span>
  );
}

function GlassCard({ children, style = {}, hover = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(16px)",
        borderRadius: 20,
        transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
        transform: hover && hovered ? "translateY(-6px) scale(1.015)" : "none",
        boxShadow: hover && hovered
          ? "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(26,188,176,0.2)"
          : "0 4px 20px rgba(0,0,0,0.25)",
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ children, color = COLORS.coral }) {
  return (
    <span style={{
      background: color,
      color: "#fff",
      fontSize: 11,
      fontWeight: 700,
      padding: "3px 10px",
      borderRadius: 20,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    }}>{children}</span>
  );
}

function WhatsAppBtn({ label = "WhatsApp Inquiry", message = "Hello, I would like to make an inquiry about Diani Experience." }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => saveEnquiry({ channel: "whatsapp", subject: label, message })}
      style={{
      background: "#25D366",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "10px 18px",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 6,
      textDecoration: "none",
      justifyContent: "center",
    }}>
      <span>💬</span> {label}
    </a>
  );
}

function EmailBtn({ label = "Email Inquiry", subject = "Diani Experience Inquiry", body = "Hello, I would like to make an inquiry." }) {
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <a href={href} onClick={() => saveEnquiry({ channel: "email", subject, message: body })} style={{
      background: "rgba(255,255,255,0.08)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 12,
      padding: "10px 18px",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 6,
      textDecoration: "none",
      justifyContent: "center",
    }}>
      <span>✉️</span> {label}
    </a>
  );
}

function BookBtn({ label = "Book Now", color = COLORS.coral, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "10px 20px",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
    }}>
      {label}
    </button>
  );
}

// === BOOKING MODAL ===
function BookingModal({ experience, onClose }) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentBusy, setPaymentBusy] = useState(false);

  const priceNum = experience
    ? Number((experience.price.match(/\d[\d,]*/)?.[0] || "0").replace(/,/g, ""))
    : 0;
  const total = priceNum * guests;

  if (!experience) return null;

  const handlePayment = async () => {
    if (!date) {
      setPaymentStatus("Choose a booking date first.");
      return;
    }
    if (!phone.trim()) {
      setPaymentStatus("Enter the customer's M-Pesa phone number.");
      return;
    }

    setPaymentBusy(true);
    setPaymentStatus("Sending M-Pesa STK Push...");

    try {
      const response = await fetch("/api/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: total,
          item: experience.name,
          category: experience.tag || experience.type || "Booking",
          guests,
          date,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setPaymentStatus(data.message || "The payment request could not be sent.");
        return;
      }

      setPaymentStatus(data.message);
      setConfirmed(true);
    } catch (error) {
      setPaymentStatus("Could not reach the payment server. Make sure npm run dev is still running.");
    } finally {
      setPaymentBusy(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(4,43,61,0.85)",
      backdropFilter: "blur(10px)", zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "linear-gradient(135deg, #0d3347, #042B3D)",
        border: "1px solid rgba(26,188,176,0.3)",
        borderRadius: 24, padding: 36, width: "100%", maxWidth: 480,
        boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
      }}>
        {!confirmed ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Book Experience</div>
                <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{experience.name}</div>
              </div>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 12, width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            <div style={{ background: "rgba(26,188,176,0.1)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Duration</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{experience.duration}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Price per person</span>
                <span style={{ color: COLORS.gold, fontWeight: 700 }}>{experience.price}</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, display: "block", marginBottom: 8 }}>Select Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", fontFamily: "inherit", fontSize: 15, boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, display: "block", marginBottom: 8 }}>Number of Guests</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 20, cursor: "pointer" }}>−</button>
                <span style={{ color: "#fff", fontSize: 22, fontWeight: 700, minWidth: 30, textAlign: "center" }}>{guests}</span>
                <button onClick={() => setGuests(guests + 1)} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 20, cursor: "pointer" }}>+</button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, display: "block", marginBottom: 8 }}>M-Pesa Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0797373482 or 254797373482"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", fontFamily: "inherit", fontSize: 15, boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ background: "rgba(255,107,53,0.1)", borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Total ({guests} guests)</span>
              <span style={{ color: COLORS.coral, fontSize: 22, fontWeight: 800 }}>KES {total.toLocaleString()}</span>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handlePayment}
                disabled={paymentBusy}
                style={{
                  flex: 1, padding: "14px", borderRadius: 14,
                  background: date && phone && !paymentBusy ? `linear-gradient(135deg, ${COLORS.coral}, #e05520)` : "rgba(255,255,255,0.1)",
                  border: "none", color: "#fff", fontFamily: "inherit",
                  fontWeight: 800, fontSize: 15, cursor: date && phone && !paymentBusy ? "pointer" : "not-allowed",
                }}
              >{paymentBusy ? "Sending..." : "Pay with M-Pesa"}</button>
              <WhatsAppBtn label="WhatsApp" message={`Hello, I need help booking ${experience.name}.`} />
            </div>
            {paymentStatus && (
              <div className="sans" style={{ marginTop: 14, color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.5 }}>
                {paymentStatus}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <div style={{ color: COLORS.teal, fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Booking Confirmed!</div>
            <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{experience.name}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 4 }}>{date} · {guests} guests</div>
            <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: 18, marginBottom: 24 }}>KES {total.toLocaleString()}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 24 }}>An STK Push has been sent to {phone}. Complete it with your M-Pesa PIN.</div>
            <button onClick={onClose} style={{ background: `linear-gradient(135deg, ${COLORS.teal}, #0d9488)`, border: "none", color: "#fff", borderRadius: 14, padding: "12px 32px", fontFamily: "inherit", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              Explore More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === MAIN APP ===
export default function DianiTourism() {
  const [activeNav, setActiveNav] = useState("Explore");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingExp, setBookingExp] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const sectionRefs = useRef({});

  const filters = ["All", "Water", "Land", "Night", "Cultural"];
  const navTargets = {
    Explore: "categories",
    Restaurants: "restaurants",
    Experiences: "experiences",
    Hotels: "hotels",
    Transport: "transport",
    About: "about",
    Contact: "contact",
  };

  const particles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      id: i,
      width: 5 + (i % 4) * 2,
      height: 5 + ((i + 2) % 4) * 2,
    })),
    []
  );

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(prev => ({ ...prev, [e.target.id]: true }));
      }),
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const handleResize = () => setIsMobile(media.matches);
    handleResize();
    media.addEventListener("change", handleResize);
    return () => media.removeEventListener("change", handleResize);
  }, []);

  const setSectionRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const fadeIn = (id, delay = 0) => ({
    opacity: visibleSections[id] ? 1 : 0,
    transform: visibleSections[id] ? "translateY(0)" : "translateY(40px)",
    transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
  });

  const navBg = scrollY > 80 ? "rgba(4,43,61,0.95)" : "transparent";

  const scrollToSection = (label) => {
    const target = navTargets[label] || label;
    const navLabel = Object.keys(navTargets).find(key => navTargets[key] === target);
    if (navLabel) setActiveNav(navLabel);
    setMenuOpen(false);
    const el = target ? document.getElementById(target) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (text) => !query || text.toLowerCase().includes(query);
  const matchesFilter = (item) => {
    if (activeFilter === "All") return true;
    const haystack = `${item.name} ${item.tag || ""} ${item.duration || ""}`.toLowerCase();
    const filterMap = {
      Water: ["dolphin", "snorkeling", "dhow", "kite", "water", "sunset"],
      Land: ["quad", "forest", "walk", "safari"],
      Night: ["sunset", "cruise"],
      Cultural: ["wasini", "dhow", "colobus"],
    };
    return filterMap[activeFilter]?.some(word => haystack.includes(word));
  };

  const filteredRestaurants = RESTAURANTS.filter(r =>
    matchesQuery(`${r.name} ${r.cuisine} ${r.tags.join(" ")} ${r.price}`)
  );

  const filteredExperiences = EXPERIENCES.filter(exp =>
    matchesFilter(exp) && matchesQuery(`${exp.name} ${exp.tag} ${exp.duration} ${exp.price}`)
  );

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: COLORS.deep,
      color: COLORS.white,
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #042B3D; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #042B3D; }
        ::-webkit-scrollbar-thumb { background: #1ABCB0; border-radius: 3px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes waveFlow { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .hero-title { font-family: 'Playfair Display', Georgia, serif !important; }
        .sans { font-family: 'DM Sans', sans-serif !important; }
        .nav-link:hover { color: #1ABCB0 !important; }
        .category-card:hover .cat-icon { transform: scale(1.2) rotate(-5deg) !important; }
        .filter-btn:hover { background: rgba(26,188,176,0.2) !important; }
      `}</style>

      {/* BOOKING MODAL */}
      {bookingExp && <BookingModal experience={bookingExp} onClose={() => setBookingExp(null)} />}

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: navBg,
        backdropFilter: scrollY > 80 ? "blur(20px)" : "none",
        borderBottom: scrollY > 80 ? "1px solid rgba(26,188,176,0.15)" : "none",
        transition: "all 0.4s ease",
        padding: "0 5%",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.coral})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "#fff",
            }}>🌊</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18, color: "#fff", lineHeight: 1 }}>Diani</div>
              <div className="sans" style={{ fontSize: 10, color: COLORS.teal, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Experience</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {NAV_LINKS.map(link => (
              <button
                key={link}
                className="nav-link sans"
                onClick={() => scrollToSection(link)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: activeNav === link ? COLORS.teal : "rgba(255,255,255,0.8)",
                  fontWeight: activeNav === link ? 700 : 400,
                  fontSize: 14, transition: "color 0.2s",
                  fontFamily: "inherit",
                  display: isMobile ? "none" : "block",
                }}
              >{link}</button>
            ))}
            <button onClick={() => scrollToSection("Experiences")} style={{
              background: `linear-gradient(135deg, ${COLORS.coral}, #e05520)`,
              color: "#fff", border: "none", borderRadius: 12,
              padding: "9px 20px", fontFamily: "inherit", fontWeight: 700,
              fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
              display: isMobile ? "none" : "block",
            }}>Book Now</button>
            <button
              onClick={() => setMenuOpen(open => !open)}
              className="sans"
              aria-label="Toggle navigation menu"
              style={{
                display: isMobile ? "flex" : "none",
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
        {isMobile && menuOpen && (
          <div style={{ padding: "0 0 16px", display: "grid", gap: 8 }}>
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => scrollToSection(link)}
                className="sans"
                style={{
                  background: activeNav === link ? "rgba(26,188,176,0.18)" : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: activeNav === link ? COLORS.teal : "#fff",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
        {/* Background Image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=1800&q=80')",
          backgroundSize: "cover", backgroundPosition: "center",
          transform: `scale(1.05) translateY(${scrollY * 0.3}px)`,
          transition: "transform 0.1s linear",
        }} />

        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,43,61,0.3) 0%, rgba(4,43,61,0.5) 40%, rgba(4,43,61,0.95) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 40%, rgba(26,188,176,0.12) 0%, transparent 60%)" }} />

        {/* Floating particles */}
        {particles.map((particle, i) => (
          <div key={i} style={{
            position: "absolute",
            width: particle.width,
            height: particle.height,
            borderRadius: "50%",
            background: i % 2 === 0 ? COLORS.teal : COLORS.coral,
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
            opacity: 0.4,
            animation: `float ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", textAlign: "center",
          padding: "0 5%", paddingTop: 72,
        }}>
          <div className="sans" style={{
            color: COLORS.teal, fontSize: 13, fontWeight: 700,
            letterSpacing: "0.25em", textTransform: "uppercase",
            marginBottom: 20, animation: "fadeSlideUp 0.8s ease both",
          }}>
            🌴 Kenya's Premier Beach Destination
          </div>

          <h1 className="hero-title" style={{
            fontSize: "clamp(42px, 8vw, 90px)",
            fontWeight: 900, lineHeight: 1.05,
            color: "#fff", marginBottom: 24,
            animation: "fadeSlideUp 0.8s ease 0.1s both",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            maxWidth: 900,
          }}>
            Discover Diani<br />
            <span style={{ color: COLORS.teal }}>Like Never</span>{" "}
            <span style={{ color: COLORS.coral }}>Before</span>
          </h1>

          <p className="sans" style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "rgba(255,255,255,0.8)", maxWidth: 580, lineHeight: 1.7,
            marginBottom: 40, animation: "fadeSlideUp 0.8s ease 0.2s both",
          }}>
            Explore pristine beaches, world-class restaurants, thrilling adventures, and unforgettable nightlife on Kenya's most beautiful coastline.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", animation: "fadeSlideUp 0.8s ease 0.3s both" }}>
            <button onClick={() => scrollToSection("Experiences")} style={{
              background: `linear-gradient(135deg, ${COLORS.coral}, #e05520)`,
              color: "#fff", border: "none", borderRadius: 16,
              padding: "16px 36px", fontFamily: "inherit", fontWeight: 700,
              fontSize: 16, cursor: "pointer",
              boxShadow: "0 8px 30px rgba(255,107,53,0.5)",
              letterSpacing: "0.03em",
            }}>Explore Experiences ✨</button>
            <button onClick={() => scrollToSection("testimonials")} style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: 16, padding: "16px 36px",
              fontFamily: "inherit", fontWeight: 700, fontSize: 16, cursor: "pointer",
            }}>Guest Stories</button>
          </div>

          {/* Stats strip */}
          <div style={{
            display: "flex", gap: 40, marginTop: 60,
            animation: "fadeSlideUp 0.8s ease 0.4s both",
            flexWrap: "wrap", justifyContent: "center",
          }}>
            {[["200+", "Experiences"], ["48", "Restaurants"], ["4.9★", "Avg Rating"], ["12K+", "Happy Guests"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: COLORS.gold }}>{n}</div>
                <div className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <svg style={{ position: "absolute", bottom: -2, left: 0, width: "100%", zIndex: 2 }} viewBox="0 0 1440 80" fill="none">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#042B3D" />
        </svg>
      </section>

      {/* ===== SEARCH BAR ===== */}
      <section style={{ padding: "0 5%", marginTop: -20, position: "relative", zIndex: 10 }}>
        <div style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 24, padding: "20px 28px",
          display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center",
          maxWidth: 900, margin: "0 auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="sans" style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Where</div>
            <input
              placeholder="Search experiences, restaurants..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="sans"
              style={{
                background: "none", border: "none", outline: "none",
                color: "#fff", fontSize: 15, fontFamily: "inherit", width: "100%",
              }}
            />
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ minWidth: 140 }}>
            <div className="sans" style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Category</div>
            <select
              value={activeFilter}
              onChange={e => setActiveFilter(e.target.value)}
              className="sans"
              style={{ background: "none", border: "none", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%" }}
            >
              {filters.map(f => <option key={f} value={f} style={{ background: "#042B3D" }}>{f === "All" ? "All Categories" : f}</option>)}
            </select>
          </div>
          <button onClick={() => scrollToSection("experiences")} style={{
            background: `linear-gradient(135deg, ${COLORS.coral}, #e05520)`,
            color: "#fff", border: "none", borderRadius: 14,
            padding: "12px 28px", fontFamily: "inherit", fontWeight: 700,
            fontSize: 15, cursor: "pointer", whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
          }}>🔍 Search</button>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section
        id="categories"
        ref={setSectionRef("categories")}
        style={{ padding: "80px 5% 60px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48, ...fadeIn("categories") }}>
          <div className="sans" style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Browse By</div>
          <h2 className="hero-title" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#fff" }}>Everything Diani Offers</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 20, maxWidth: 1100, margin: "0 auto",
        }}>
          {CATEGORIES.map((cat, i) => (
            <GlassCard
              key={cat.label}
              style={{ ...fadeIn("categories", i * 80) }}
            >
              <div className="category-card" style={{ padding: 28, textAlign: "center" }}>
                <div className="cat-icon" style={{
                  fontSize: 42, marginBottom: 14, display: "block",
                  transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)",
                }}>
                  {cat.icon}
                </div>
                <div style={{
                  width: 40, height: 3, borderRadius: 2,
                  background: cat.color, margin: "0 auto 12px",
                }} />
                <div className="hero-title" style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{cat.label}</div>
                <div className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{cat.count}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ===== RESTAURANTS ===== */}
      <section
        id="restaurants"
        ref={setSectionRef("restaurants")}
        style={{ padding: "60px 5%", background: "linear-gradient(180deg, transparent, rgba(26,188,176,0.04), transparent)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16, ...fadeIn("restaurants") }}>
          <div>
            <div className="sans" style={{ color: COLORS.coral, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>🍽️ Dine in Style</div>
            <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#fff" }}>Featured Restaurants</h2>
          </div>
          <button onClick={() => setSearchQuery("")} className="sans" style={{ background: "none", border: `1.5px solid ${COLORS.teal}`, color: COLORS.teal, borderRadius: 12, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit" }}>View All 48 →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {filteredRestaurants.length ? filteredRestaurants.map((r, i) => (
            <GlassCard key={r.name} style={{ ...fadeIn("restaurants", i * 100) }}>
              <div>
                <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                  <img src={r.image} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(4,43,61,0.8) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {r.tags.map(t => <Badge key={t} color="rgba(4,43,61,0.7)">{t}</Badge>)}
                  </div>
                  <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(4,43,61,0.8)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "4px 12px" }}>
                    <span className="sans" style={{ color: COLORS.gold, fontWeight: 700, fontSize: 13 }}>{r.price}</span>
                  </div>
                </div>
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div className="hero-title" style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{r.name}</div>
                      <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{r.cuisine}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <StarRating rating={r.rating} />
                      <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{r.reviews} reviews</div>
                    </div>
                  </div>
                  <div className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>⏰ {r.open}</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <BookBtn label="Reserve Table" onClick={() => setBookingExp({ ...r, duration: "Table reservation", tag: "Restaurant" })} />
                    <WhatsAppBtn label="Inquire" message={`Hello, I would like to inquire about ${r.name}.`} />
                    <EmailBtn label="Email" subject={`Inquiry about ${r.name}`} body={`Hello, I would like to inquire about ${r.name}.`} />
                  </div>
                </div>
              </div>
            </GlassCard>
          )) : (
            <GlassCard hover={false} style={{ gridColumn: "1 / -1", ...fadeIn("restaurants") }}>
              <div className="sans" style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.72)" }}>
                No restaurants match your search yet. Try a broader term.
              </div>
            </GlassCard>
          )}
        </div>
      </section>

      {/* ===== EXPERIENCES ===== */}
      <section id="experiences" ref={setSectionRef("experiences")} style={{ padding: "60px 5%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16, ...fadeIn("experiences") }}>
          <div>
            <div className="sans" style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>🌊 Adventures Await</div>
            <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#fff" }}>Tours & Experiences</h2>
          </div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {filters.map(f => (
              <button
                key={f}
                className="filter-btn sans"
                onClick={() => setActiveFilter(f)}
                style={{
                  background: activeFilter === f ? `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.ocean})` : "rgba(255,255,255,0.08)",
                  border: `1px solid ${activeFilter === f ? COLORS.teal : "rgba(255,255,255,0.12)"}`,
                  color: "#fff", borderRadius: 20, padding: "8px 18px",
                  fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22, maxWidth: 1100, margin: "0 auto" }}>
          {filteredExperiences.length ? filteredExperiences.map((exp, i) => (
            <GlassCard key={exp.name} style={{ ...fadeIn("experiences", i * 80) }} onClick={() => setBookingExp(exp)}>
              <div>
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={exp.image} alt={exp.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(4,43,61,0.85) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", top: 14, left: 14 }}>
                    <Badge color={COLORS.coral}>{exp.tag}</Badge>
                  </div>
                  <div style={{ position: "absolute", top: 14, right: 14, fontSize: 28 }}>{exp.icon}</div>
                </div>
                <div style={{ padding: 20 }}>
                  <div className="hero-title" style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{exp.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>⏱ {exp.duration}</div>
                    <StarRating rating={exp.rating} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>From</div>
                      <div className="hero-title" style={{ fontSize: 20, fontWeight: 800, color: COLORS.gold }}>{exp.price}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setBookingExp(exp); }} style={{
                      background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.ocean})`,
                      border: "none", color: "#fff", borderRadius: 12,
                      padding: "10px 20px", fontFamily: "inherit", fontWeight: 700,
                      fontSize: 13, cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(26,188,176,0.4)",
                    }}>Book →</button>
                  </div>
                </div>
              </div>
            </GlassCard>
          )) : (
            <GlassCard hover={false} style={{ gridColumn: "1 / -1", ...fadeIn("experiences") }}>
              <div className="sans" style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.72)" }}>
                No experiences found for this search and filter combination.
              </div>
            </GlassCard>
          )}
        </div>
      </section>

      {/* ===== HOTELS ===== */}
      <section id="hotels" ref={setSectionRef("hotels")} style={{ padding: "60px 5%", background: "linear-gradient(180deg, transparent, rgba(10,126,164,0.06), transparent)" }}>
        <div style={{ textAlign: "center", marginBottom: 48, ...fadeIn("hotels") }}>
          <div className="sans" style={{ color: COLORS.ocean, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>🏨 Rest in Luxury</div>
          <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#fff" }}>Where to Stay</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {HOTELS.map((h, i) => (
            <GlassCard key={h.name} style={{ ...fadeIn("hotels", i * 100) }}>
              <div>
                <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                  <img src={h.image} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(4,43,61,0.8) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", top: 14, left: 14 }}>
                    <Badge color={COLORS.ocean}>{h.type}</Badge>
                  </div>
                  <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(4,43,61,0.8)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                    <div className="sans" style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>per night</div>
                    <div className="hero-title" style={{ color: COLORS.gold, fontWeight: 800, fontSize: 16 }}>{h.price}</div>
                  </div>
                </div>
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div className="hero-title" style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{h.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StarRating rating={h.rating} />
                      <span className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>({h.reviews})</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                    {h.amenities.map(a => (
                      <span key={a} className="sans" style={{ fontSize: 12, background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "4px 10px", color: "rgba(255,255,255,0.6)" }}>{a}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <BookBtn label="Check Availability" color={COLORS.ocean} onClick={() => setBookingExp({ ...h, duration: "Overnight stay", tag: "Hotel" })} />
                    <WhatsAppBtn label="Inquire" message={`Hello, I would like to inquire about ${h.name}.`} />
                    <EmailBtn label="Email" subject={`Inquiry about ${h.name}`} body={`Hello, I would like to inquire about ${h.name}.`} />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ===== TRANSPORT ===== */}
      <section id="transport" ref={setSectionRef("transport")} style={{ padding: "60px 5%" }}>
        <div style={{ ...fadeIn("transport"), marginBottom: 48, textAlign: "center" }}>
          <div className="sans" style={{ color: "#2ECC71", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>🚗 Get Around</div>
          <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#fff" }}>Transport Services</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {TRANSPORT.map((t, i) => (
            <GlassCard key={t.name} style={{ ...fadeIn("transport", i * 80) }}>
              <div style={{ padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>{t.icon}</div>
                <div className="hero-title" style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{t.name}</div>
                <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 16 }}>{t.desc}</div>
                <div style={{ color: COLORS.gold, fontWeight: 700, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>{t.price}</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <WhatsAppBtn label="Book via WhatsApp" message={`Hello, I would like to book ${t.name}.`} />
                  <EmailBtn label="Email Inquiry" subject={`Inquiry about ${t.name}`} body={`Hello, I would like to inquire about ${t.name}.`} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" ref={setSectionRef("testimonials")} style={{ padding: "80px 5%", background: "linear-gradient(180deg, transparent, rgba(212,168,67,0.04), transparent)" }}>
        <div style={{ textAlign: "center", marginBottom: 60, ...fadeIn("testimonials") }}>
          <div className="sans" style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>⭐ Loved By Travelers</div>
          <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#fff" }}>Guest Stories</h2>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Active testimonial */}
          <GlassCard hover={false} style={{ marginBottom: 32 }}>
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 20, color: COLORS.gold }}>❝</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(17px, 2.5vw, 22px)", fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.7, marginBottom: 28 }}>
                {TESTIMONIALS[testimonialIdx].text}
              </p>
              <img src={TESTIMONIALS[testimonialIdx].avatar} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `3px solid ${COLORS.teal}`, marginBottom: 12 }} />
              <div className="hero-title" style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{TESTIMONIALS[testimonialIdx].name}</div>
              <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{TESTIMONIALS[testimonialIdx].country}</div>
            </div>
          </GlassCard>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                width: i === testimonialIdx ? 28 : 8,
                height: 8, borderRadius: 4, border: "none", cursor: "pointer",
                background: i === testimonialIdx ? COLORS.teal : "rgba(255,255,255,0.2)",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAP BANNER ===== */}
      <section id="about" style={{ padding: "40px 5%" }}>
        <GlassCard hover={false} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            padding: "48px", display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap",
            background: "linear-gradient(135deg, rgba(26,188,176,0.1), rgba(10,126,164,0.1))",
          }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <div className="sans" style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>📍 Find Your Way</div>
              <h3 className="hero-title" style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>Explore the<br />Interactive Map</h3>
              <p className="sans" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>Discover restaurants, hotels, and experiences right on the map. Filter by category, distance, and rating.</p>
              <a href="https://www.google.com/maps/search/?api=1&query=Diani+Beach+Kenya" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.ocean})`, border: "none", color: "#fff", borderRadius: 14, padding: "14px 32px", fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px rgba(26,188,176,0.4)", textDecoration: "none" }}>Open Map 🗺️</a>
            </div>
            <div style={{ flex: 1, minWidth: 250, height: 220, borderRadius: 16, overflow: "hidden", position: "relative", background: "rgba(10,126,164,0.2)", border: "1px solid rgba(26,188,176,0.2)" }}>
              {/* Fake map visual */}
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0a4d6e, #042B3D)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 48, animation: "float 3s ease-in-out infinite" }}>📍</div>
                <div className="sans" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Diani Beach, Kenya</div>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  {["🍽️","🏨","🤿","🌙"].map((ic, i) => (
                    <div key={i} style={{
                      background: "rgba(26,188,176,0.3)", borderRadius: 8,
                      width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }}>{ic}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* ===== NEWSLETTER / CTA ===== */}
      <section style={{ padding: "80px 5%" }}>
        <div style={{
          maxWidth: 700, margin: "0 auto", textAlign: "center",
          background: `linear-gradient(135deg, rgba(255,107,53,0.15), rgba(26,188,176,0.15))`,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 28, padding: "60px 40px",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌴</div>
          <h3 className="hero-title" style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>Stay in the Loop</h3>
          <p className="sans" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>Get exclusive deals, new experience alerts, and Diani travel tips delivered to your inbox.</p>
          <div style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="your@email.com"
              className="sans"
              style={{
                flex: 1, minWidth: 200, padding: "14px 20px", borderRadius: 14,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", fontFamily: "inherit", fontSize: 15, outline: "none",
              }}
            />
            <button style={{
              background: `linear-gradient(135deg, ${COLORS.coral}, #e05520)`,
              color: "#fff", border: "none", borderRadius: 14,
              padding: "14px 28px", fontFamily: "inherit", fontWeight: 700,
              fontSize: 15, cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
            }} onClick={() => window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Diani Experience Newsletter")}&body=${encodeURIComponent("Hello, I would like to receive updates and offers.")}`}>Subscribe ✉️</button>
          </div>
          <div className="sans" style={{ marginTop: 18, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Enquiries go to {CONTACT_EMAIL} or WhatsApp +{WHATSAPP_NUMBER}.
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contact" style={{
        background: "rgba(0,0,0,0.4)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "60px 5% 30px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 50 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.coral})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌊</div>
                <div className="hero-title" style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Diani Experience</div>
              </div>
              <p className="sans" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7 }}>Kenya's premier platform for discovering and booking the best of Diani Beach.</p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <WhatsAppBtn label="WhatsApp" />
                <EmailBtn label="Email" />
              </div>
            </div>
            {[
              { title: "Explore", links: ["Restaurants", "Experiences", "Hotels", "Transport", "Nightlife"] },
              { title: "Company", links: ["About Us", "Partnerships", "Careers", "Press", "Blog"] },
              { title: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Use", "Sitemap"] },
            ].map(col => (
              <div key={col.title}>
                <div className="sans" style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} className="sans" style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = COLORS.teal}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
                  >{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div className="sans" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>© 2026 Diani Experience. All rights reserved.</div>
            <div className="sans" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Made with ❤️ in Diani, Kenya 🇰🇪</div>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING WHATSAPP ===== */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I would like to make an inquiry about Diani Experience.")}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 900,
          width: 56, height: 56, borderRadius: "50%",
          background: "#25D366",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, textDecoration: "none",
          boxShadow: "0 8px 30px rgba(37,211,102,0.5)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >💬</a>
    </div>
  );
}
