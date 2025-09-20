import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DMCA() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                DMCA Notice & Takedown Policy
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Last updated: August 9, 2025
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Digital Millennium Copyright Act Policy</h2>
                <p className="mb-4">
                  SPIRAL respects the intellectual property rights of others and expects users 
                  to do the same. We will respond to clear notices of alleged copyright infringement 
                  that comply with the Digital Millennium Copyright Act ("DMCA").
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Filing a DMCA Notice</h2>
                <p className="mb-4">
                  If you believe that content on our platform infringes your copyright, please 
                  provide our designated agent with the following information:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                  <li>Identification of the copyrighted work claimed to have been infringed</li>
                  <li>Identification of the allegedly infringing material and its location</li>
                  <li>Your contact information (address, phone number, email)</li>
                  <li>A statement of good faith belief that the use is not authorized</li>
                  <li>A statement of accuracy and authority to act on behalf of the copyright owner</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Counter-Notification</h2>
                <p className="mb-4">
                  If you believe your content was removed in error, you may file a counter-notification 
                  containing:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>Your physical or electronic signature</li>
                  <li>Identification of the removed content and its prior location</li>
                  <li>A statement of good faith belief that removal was due to mistake or misidentification</li>
                  <li>Your contact information and consent to jurisdiction</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Repeat Infringer Policy</h2>
                <p className="mb-4">
                  SPIRAL will terminate user accounts that are determined to be repeat infringers 
                  of copyrighted content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Designated Agent</h2>
                <p className="mb-4">
                  Send DMCA notices to our designated agent:
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p><strong>DMCA Agent</strong><br />
                  SPIRAL Inc.<br />
                  Email: dmca@spiralshops.com<br />
                  Mail: [Physical Address]<br />
                  Phone: [Phone Number]</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Response Time</h2>
                <p className="mb-4">
                  We will respond to valid DMCA notices within 24-48 hours and take appropriate 
                  action, which may include removing or disabling access to allegedly infringing content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">False Claims</h2>
                <p className="mb-4">
                  Please note that under Section 512(f) of the DMCA, any person who knowingly 
                  materially misrepresents that material is infringing may be subject to liability 
                  for damages.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}