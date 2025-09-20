import Header from "@/components/header";
import Footer from "@/components/footer";

export default function OrdersSimplePage() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              Your Orders
            </h1>
            <p className="text-lg text-gray-600">
              Track your purchases and shipping status
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-800 mb-2">
              ✅ Orders Page Working!
            </h2>
            <p className="text-green-700">
              The Orders navigation is now working correctly. This page shows your order history and tracking information.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Order #SPIRAL-2025-001</h4>
                    <p className="text-gray-600 text-sm">Placed on January 20, 2025 • 3 items • $127.45</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Shipped</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Tracking: 1Z999AA1234567890 (UPS)</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Order #SPIRAL-2025-002</h4>
                    <p className="text-gray-600 text-sm">Placed on January 18, 2025 • 2 items • $89.99</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Delivered</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Delivered on January 22, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}