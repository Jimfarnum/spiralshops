import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                Terms of Service
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Last updated: August 9, 2025
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing and using SPIRAL's services, you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
                <p className="mb-4">
                  SPIRAL is a local commerce platform that connects shoppers with local retailers. 
                  Our services include:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>Online marketplace for local businesses</li>
                  <li>Payment processing through third-party providers</li>
                  <li>Loyalty and rewards programs</li>
                  <li>Location-based business discovery</li>
                  <li>Order management and customer support</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                <p className="mb-4">
                  To access certain features, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and current information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Purchases and Payments</h2>
                <p className="mb-4">
                  All purchases are subject to availability and confirmation of the order price. 
                  Payment processing is handled by Stripe and subject to their terms of service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Prohibited Uses</h2>
                <p className="mb-4">You may not use our service:</p>
                <ul className="list-disc list-inside mb-4">
                  <li>For any unlawful purpose or to solicit unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations or laws</li>
                  <li>To transmit or procure the sending of any advertising or promotional material</li>
                  <li>To impersonate another person or entity</li>
                  <li>To upload malicious code or attempt to compromise system security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
                <p className="mb-4">
                  SPIRAL shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, 
                  goodwill, or other intangible losses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
                <p className="mb-4">
                  We may terminate or suspend your account and bar access to the service immediately, 
                  without prior notice or liability, under our sole discretion, for any reason whatsoever.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Contact Information</h2>
                <p className="mb-4">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <p className="mb-4">
                  <strong>Email:</strong> legal@spiralshops.com<br />
                  <strong>Mail:</strong> SPIRAL Inc., Legal Department, [Address]
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}