import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, UserPlus, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FollowRetailerButtonProps {
  retailerId: number;
  retailerName?: string;
  userId?: number;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export default function FollowRetailerButton({
  retailerId,
  retailerName = "this retailer",
  userId = 1, // Demo user ID
  variant = "outline",
  size = "default",
  showIcon = true
}: FollowRetailerButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkFollowStatus();
  }, [retailerId, userId]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/is-following/${userId}/${retailerId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const toggleFollow = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch("/api/unfollow", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            retailerId
          })
        });

        if (response.ok) {
          setIsFollowing(false);
          toast({
            title: "Unfollowed",
            description: `You are no longer following ${retailerName}`,
          });
        } else {
          throw new Error("Failed to unfollow");
        }
      } else {
        // Follow
        const response = await fetch("/api/follow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            retailerId
          })
        });

        if (response.ok) {
          setIsFollowing(true);
          toast({
            title: "Now Following!",
            description: `You'll receive updates from ${retailerName}`,
          });
        } else {
          throw new Error("Failed to follow");
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Unable to update follow status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClasses = isFollowing 
    ? "border-red-200 text-red-700 hover:bg-red-50" 
    : "border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white";

  return (
    <Button
      onClick={toggleFollow}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={variant === "outline" ? buttonClasses : ""}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          {isFollowing ? "Unfollowing..." : "Following..."}
        </>
      ) : (
        <>
          {showIcon && (
            isFollowing ? (
              <UserMinus className="w-4 h-4 mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )
          )}
          {isFollowing ? "Unfollow" : "Follow"}
        </>
      )}
    </Button>
  );
}