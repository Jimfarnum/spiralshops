import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Star, Store, ExternalLink } from "lucide-react";
import { FollowButton } from "./FollowButton";

interface PopularStoresProps {
  userId?: number;
  limit?: number;
  className?: string;
}

export function PopularStores({ 
  userId = 1, 
  limit = 10, 
  className = "" 
}: PopularStoresProps) {
  
  const { data: popularStores, isLoading, error } = useQuery({
    queryKey: ['/api/follows/popular-stores', limit],
    queryFn: () => fetch(`/api/follows/popular-stores?limit=${limit}`).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Popular Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Popular Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Failed to load popular stores.</p>
        </CardContent>
      </Card>
    );
  }

  if (!popularStores || popularStores.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Popular Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Store className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No popular stores found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Popular Stores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularStores.map((store: any, index: number) => (
            <div key={store.storeId} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{store.storeName}</h3>
                    {store.storeRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{store.storeRating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {store.storeDescription}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {store.storeCategory}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{store.totalFollowers}</span>
                      <span>followers</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>+{store.followersThisWeek} this week</span>
                    <span>+{store.followersThisMonth} this month</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <FollowButton
                  userId={userId}
                  followType="store"
                  followId={store.storeId}
                  storeName={store.storeName}
                  size="sm"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open(`/store/${store.storeId}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}