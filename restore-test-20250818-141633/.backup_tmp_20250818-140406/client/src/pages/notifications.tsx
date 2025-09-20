import Header from "@/components/header";
import Footer from "@/components/footer";
import NotificationCenter from "@/components/notification-center";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotificationCenter />
      </div>
      <Footer />
    </div>
  );
}