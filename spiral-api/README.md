# SPIRAL API – Stripe Webhook

Production webhook endpoint (Vercel):
https://api.spiralshops.com/api/billing/webhook

## Setup
1. Push to GitHub
2. Import into Vercel
3. Add domain `api.spiralshops.com`
4. Add env vars:
   - STRIPE_SECRET_KEY=sk_...
   - STRIPE_WEBHOOK_SECRET=whsec_...
   - STRIPE_PRICE_SILVER=price_...
   - STRIPE_PRICE_GOLD=price_...

## Stripe Webhooks
Subscribe to:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed