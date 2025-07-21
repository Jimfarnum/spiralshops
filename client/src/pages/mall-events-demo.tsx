import Header from "@/components/header";
import MallEvents from "@/components/mall-events";

export default function MallEventsDemo() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Mall Events Demo
          </h1>
          <p className="text-xl text-gray-600">
            Interactive demonstration of the SPIRAL mall events system
          </p>
        </div>
        <MallEvents mallId="heritage-square-mall" />
      </div>
    </div>
  );
}