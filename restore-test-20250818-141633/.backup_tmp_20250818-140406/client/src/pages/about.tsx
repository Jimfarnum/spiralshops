import Header from "@/components/header";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-8 text-center">
              About SPIRAL
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                SPIRAL is a next-generation shopping platform built for local communities. We connect real people to real stores — from Main Street to the mall — through a seamless digital experience.
              </p>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Shoppers can browse products from local retailers across the U.S., earn SPIRAL rewards, redeem them in-store or online, and share their experiences to grow a community of support for brick-and-mortar businesses.
              </p>
              
              <div className="text-center py-8">
                <p className="text-2xl font-bold text-[var(--spiral-coral)] italic">
                  Everything Local. Just for You.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">Local First</h3>
                  <p className="text-gray-600">Supporting brick-and-mortar businesses in communities across America</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--spiral-sage)] to-[var(--spiral-navy)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">Reward Loyalty</h3>
                  <p className="text-gray-600">Earn SPIRALs with every purchase and redeem for exclusive perks</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-2">Build Community</h3>
                  <p className="text-gray-600">Share experiences and connect with fellow local shopping enthusiasts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}