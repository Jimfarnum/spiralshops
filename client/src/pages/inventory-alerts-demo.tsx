import Header from "@/components/header";
import InventoryAlerts from "@/components/inventory-alerts";

export default function InventoryAlertsDemo() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Real-Time Inventory Alerts
          </h1>
          <p className="text-xl text-gray-600">
            Smart monitoring system for price drops and stock changes
          </p>
        </div>
        <InventoryAlerts />
      </div>
    </div>
  );
}