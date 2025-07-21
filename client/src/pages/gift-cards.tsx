import Header from '@/components/header';
import Footer from '@/components/footer';
import GiftCardSystem from '@/components/gift-card-system';

export default function GiftCards() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="py-8">
        <GiftCardSystem />
      </div>
      <Footer />
    </div>
  );
}