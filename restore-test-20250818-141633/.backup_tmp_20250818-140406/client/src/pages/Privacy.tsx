import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                Privacy Policy
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Last updated: August 9, 2025
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  SPIRAL collects information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support. This may include:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>Name, email address, phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Purchase history and preferences</li>
                  <li>Location data (with your permission)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside mb-4">
                  <li>Process transactions and send confirmations</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except as described in this policy. We may share information with:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>Service providers who assist with our operations</li>
                  <li>Payment processors (Stripe) for transaction processing</li>
                  <li>Law enforcement when required by law</li>
                  <li>Business partners with your explicit consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc list-inside mb-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
                <p className="mb-4">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mb-4">
                  <strong>Email:</strong> privacy@spiralshops.com<br />
                  <strong>Mail:</strong> SPIRAL Inc., Privacy Department, [Address]
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}