# Deployment

This app needs a Node web service because M-Pesa STK Push and Supabase writes run on the backend.

## Render

1. Push this folder to a GitHub repository.
2. Go to Render and create a new Web Service from that repository.
3. Use these settings:
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables from your local `.env`.
5. Deploy the service.
6. Your public URL will look like `https://pinkey-19-seafood-restaurant.onrender.com`.

For M-Pesa callbacks, set:

```env
MPESA_CALLBACK_URL=https://your-render-url.onrender.com/api/mpesa-callback
```

Keep these private in Render environment variables:

```env
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
MPESA_PASSKEY
SUPABASE_SERVICE_ROLE_KEY
```
