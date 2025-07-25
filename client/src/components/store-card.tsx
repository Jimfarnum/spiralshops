import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Store } from "@shared/schema";
import VerifiedBadge from "./VerifiedBadge";

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img 
          src={store.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
          alt={store.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
          <span className="text-sm text-gray-500">0.3 mi</span>
        </div>
        
        <div className="mb-3">
          <VerifiedBadge 
            isVerified={store.isVerified || false} 
            tier={store.verificationTier as "Unverified" | "Basic" | "Local" | "Regional" | "National" | null}
          />
        </div>
        
        <p className="text-gray-600 mb-4">{store.description}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {store.rating} ({store.reviewCount} reviews)
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{store.address}</span>
        </div>
        
        <Link href={`/store/${store.id}`}>
          <Button className="w-full bg-spiral-blue text-white hover:bg-spiral-blue-dark">
            View Store
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
