import { Router } from 'express';
import { storage } from '../../storage';

const router = Router();

// Stripe OAuth callback handler
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Handle Stripe OAuth errors
    if (error) {
      console.error('Stripe OAuth error:', error);
      return res.redirect('/retailer-onboard-agent?error=stripe_oauth_failed');
    }

    if (!code) {
      return res.redirect('/retailer-onboard-agent?error=missing_code');
    }

    // Exchange authorization code for access token
    const params = new URLSearchParams();
    params.append('client_secret', process.env.STRIPE_SECRET_KEY || '');
    params.append('code', code as string);
    params.append('grant_type', 'authorization_code');

    const response = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const stripeData = await response.json();

    if (!stripeData.stripe_user_id) {
      console.error('Stripe OAuth failed:', stripeData);
      return res.redirect('/retailer-onboard-agent?error=stripe_failed');
    }

    // In a real implementation, you would use the state parameter to identify the retailer
    // For now, we'll find the most recently created retailer with pending Stripe status
    const retailers = await storage.getRetailers();
    const pendingRetailer = retailers
      .filter(r => r.onboardingStatus === 'info_collected')
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0];

    if (!pendingRetailer) {
      return res.redirect('/retailer-onboard-agent?error=retailer_not_found');
    }

    // Update retailer with Stripe account information
    await storage.updateRetailer(pendingRetailer.id, {
      stripeAccountId: stripeData.stripe_user_id,
      onboardingStatus: 'payment_setup',
    });

    // Redirect to success page with retailer ID
    return res.redirect(`/retailer/onboarding/success?id=${pendingRetailer.id}&stripe_id=${stripeData.stripe_user_id}`);

  } catch (error: any) {
    console.error('Stripe callback error:', error);
    return res.redirect('/retailer-onboard-agent?error=internal_error');
  }
});

export default router;