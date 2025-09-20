import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-6">Privacy Policy</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              <strong>Effective Date:</strong> January 1, 2025
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Information We Collect
            </h2>
            <p className="mb-4">
              SPIRAL collects information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support. This may include your name, email address, 
              phone number, and payment information.
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and improve our services</li>
              <li>To process transactions and send related information</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To respond to your comments and questions</li>
              <li>To detect and prevent fraud</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Information Sharing
            </h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy or as required by law.
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: <a href="mailto:privacy@spiralshops.com" className="text-[var(--spiral-coral)] hover:underline">privacy@spiralshops.com</a>
              <br />
              Phone: <a href="tel:+1-800-SPIRAL" className="text-[var(--spiral-coral)] hover:underline">1-800-SPIRAL</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}