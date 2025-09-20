import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bell, BellOff, Store, MapPin, Star } from "lucide-react";
import { FollowButton } from "./FollowButton";

interface FollowedStoresListProps {
  userId: number;
  followType?: 'store' | 'retailer' | 'mall';
  className?: string;
}

export function FollowedStoresList({ 
  userId, 
  followType = 'store',
  className = "" 
}: FollowedStoresListProps) {
  
  const { data: followedStores, isLoading, error } = useQuery({
    queryKey: ['/api/follows/user', userId, followType],
    queryFn: () => fetch(`/api/follows/user/${userId}?type=${followType}`).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Following
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
            <Heart className="w-5 h-5" />
            Following
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Failed to load followed stores.</p>
        </CardContent>
      </Card>
    );
  }

  if (!followedStores || followedStores.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Following
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Store className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">You're not following any stores yet</p>
            <p className="text-sm text-gray-400">
              Follow your favorite stores to get updates on new products, sales, and events!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Following ({followedStores.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {followedStores.map((follow: any) => (
            <div key={follow.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{follow.storeName}</h3>
                  {follow.storeRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{follow.storeRating}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {follow.storeDescription}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Store className="w-4 h-4" />
                    <span>{follow.storeCategory}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {follow.notificationsEnabled ? (
                      <Bell className="w-4 h-4 text-blue-600" />
                    ) : (
                      <BellOff className="w-4 h-4 text-gray-400" />
                    )}
                    <span>
                      {follow.notificationsEnabled ? 'Notifications on' : 'Notifications off'}
                    </span>
                  </div>
                </div>

                {follow.tags && follow.tags.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {follow.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Following since {new Date(follow.followedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="ml-4">
                <FollowButton
                  userId={userId}
                  followType={follow.followType}
                  followId={follow.followId}
                  storeName={follow.storeName}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}