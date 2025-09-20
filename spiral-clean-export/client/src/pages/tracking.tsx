import Header from "@/components/header";
import Footer from "@/components/footer";
import ShippingTracking from "@/components/shipping-tracking";

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShippingTracking />
      </div>
      <Footer />
    </div>
  );
}