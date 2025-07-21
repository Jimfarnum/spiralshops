import Header from '@/components/header';
import Footer from '@/components/footer';
import MallEventsCalendar from '@/components/mall-events-calendar';

export default function Events() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="py-8">
        <MallEventsCalendar />
      </div>
      <Footer />
    </div>
  );
}