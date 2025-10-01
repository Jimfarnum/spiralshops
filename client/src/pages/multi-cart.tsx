import Header from '@/components/header';
import Footer from '@/components/footer';
import MultiRetailerCart from '@/components/multi-retailer-cart';

export default function MultiCart() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="py-8">
        <MultiRetailerCart />
      </div>
      <Footer />
    </div>
  );
}