import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

interface LocationButtonProps {
  onLocationUpdate?: (coordinates: { lat: number; lng: number }) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showCoordinates?: boolean;
  className?: string;
}

export default function LocationButton({
  onLocationUpdate,
  variant = 'outline',
  size = 'default',
  showCoordinates = false,
  className = ''
}: LocationButtonProps) {
  const { coordinates, loading, error, getCurrentLocation, clearError } = useLocation();
  const { toast } = useToast();

  const handleLocationRequest = async () => {
    try {
      clearError();
      const coords = await getCurrentLocation();
      
      if (onLocationUpdate) {
        onLocationUpdate(coords);
      }
      
      toast({
        title: "Location Found",
        description: "Your location has been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Location Error",
        description: err instanceof Error ? err.message : "Could not get your location",
        variant: "destructive"
      });
    }
  };

  const formatCoordinates = (coords: { lat: number; lng: number }) => {
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleLocationRequest}
        disabled={loading}
        className="flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
        {loading ? 'Getting Location...' : 'Use My Location'}
      </Button>

      {coordinates && showCoordinates && (
        <Badge variant="secondary" className="text-xs">
          {formatCoordinates(coordinates)}
        </Badge>
      )}

      {error && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}