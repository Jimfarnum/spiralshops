import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, Bell, BellOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  userId: number;
  followType: 'store' | 'retailer' | 'mall';
  followId: number;
  storeName?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function FollowButton({ 
  userId, 
  followType, 
  followId, 
  storeName, 
  className = "",
  size = 'default',
  variant = 'outline'
}: FollowButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Check if user is following this entity
  const { data: followStatus, isLoading } = useQuery({
    queryKey: ['/api/follows/check', userId, followType, followId],
    queryFn: () => fetch(`/api/follows/check/${userId}/${followType}/${followId}`).then(res => res.json()),
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/follows`, {
        method: 'POST',
        body: {
          userId,
          followType,
          followId,
          notificationsEnabled: true,
          tags: ['favorite']
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/follows/check', userId, followType, followId] });
      queryClient.invalidateQueries({ queryKey: ['/api/follows/user', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/follows/stats', followId] });
      
      toast({
        title: "Following!",
        description: `You're now following ${storeName || 'this store'}. You'll get notifications about new products and sales.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Follow failed",
        description: error.message || "Failed to follow. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/follows/${userId}/${followType}/${followId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/follows/check', userId, followType, followId] });
      queryClient.invalidateQueries({ queryKey: ['/api/follows/user', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/follows/stats', followId] });
      
      toast({
        title: "Unfollowed",
        description: `You've unfollowed ${storeName || 'this store'}.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Unfollow failed",
        description: error.message || "Failed to unfollow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleFollow = () => {
    if (followStatus?.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const isFollowing = followStatus?.isFollowing;
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        disabled
      >
        <Heart className="w-4 h-4 mr-1" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? 'default' : variant}
      size={size}
      className={`${className} ${isFollowing ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
      onClick={handleToggleFollow}
      disabled={isPending}
    >
      <Heart 
        className={`w-4 h-4 mr-1 ${isFollowing ? 'fill-current' : ''}`} 
      />
      {isPending ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
      {isFollowing && followStatus?.followData?.notificationsEnabled && (
        <Bell className="w-3 h-3 ml-1" />
      )}
    </Button>
  );
}