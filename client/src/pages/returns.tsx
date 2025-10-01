import Header from "@/components/header";
import Footer from "@/components/footer";
import ReturnsRefunds from "@/components/returns-refunds";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReturnsRefunds />
      </div>
      <Footer />
    </div>
  );
}