// Vercel Serverless Function for Stripe Webhook
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } }; // required for signature verification

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  let event;
  try {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        console.log("✅ Checkout complete:", event.data.object.id);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log("✅ Subscription event:", event.type);
        // TODO: update retailer plan in your DB here
        break;
      case "invoice.payment_succeeded":
        console.log("✅ Payment succeeded");
        break;
      case "invoice.payment_failed":
        console.log("⚠️ Payment failed");
        break;
      default:
        console.log("Unhandled event:", event.type);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Handler error:", err);
    return res.status(500).send("Internal handler error");
  }
}