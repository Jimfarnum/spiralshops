import Header from "@/components/header";
import Footer from "@/components/footer";
import SavedAddresses from "@/components/saved-addresses";

export default function SavedAddressesPage() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SavedAddresses />
      </div>
      <Footer />
    </div>
  );
}