import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-6">Terms of Service</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              <strong>Effective Date:</strong> January 1, 2025
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using the SPIRAL platform, you accept and agree to be bound by the 
              terms and provision of this agreement.
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Use License
            </h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of SPIRAL materials for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              User Accounts
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to provide accurate and complete information</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>One person or legal entity may not maintain more than one account</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              SPIRAL Rewards Program
            </h2>
            <p className="mb-4">
              SPIRALs are loyalty points that can be earned through purchases and redeemed for discounts. 
              SPIRALs have no cash value and cannot be transferred between accounts.
            </p>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Prohibited Uses
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Violating any applicable laws or regulations</li>
              <li>Transmitting spam or unsolicited communications</li>
              <li>Attempting to gain unauthorized access to the platform</li>
              <li>Using the service for fraudulent purposes</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-[var(--spiral-navy)] mt-6 mb-3">
              Contact Information
            </h2>
            <p className="mb-4">
              For questions regarding these Terms of Service, please contact:
              <br />
              Email: <a href="mailto:legal@spiralshops.com" className="text-[var(--spiral-coral)] hover:underline">legal@spiralshops.com</a>
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