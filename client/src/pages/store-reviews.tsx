import { useRoute, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import ProductReviews from "@/components/product-reviews";

export default function StoreReviews() {
  const [, params] = useRoute("/store/:storeId/reviews");
  const { storeId } = params || {};

  // Mock store data - in real app would fetch from API
  const store = {
    id: storeId || "1",
    name: "Local Artisan Goods",
    category: "Home & Garden",
    location: "Downtown District",
    description: "Curated collection of handmade goods from local artisans"
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={`/store/${store.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
              Reviews for {store.name}
            </h1>
            <p className="text-gray-600">
              {store.category} • {store.location}
            </p>
          </div>
        </div>

        {/* Store Reviews Component */}
        <ProductReviews
          storeId={parseInt(store.id)}
          reviewType="store"
          targetName={store.name}
        />
      </div>
    </div>
  );
}