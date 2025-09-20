import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import LocationButton from '@/components/LocationButton';
import { MapPin, Filter, X } from 'lucide-react';

interface NearMeFilterProps {
  onRadiusChange?: (radius: number) => void;
  onLocationChange?: (coordinates: { lat: number; lng: number } | null) => void;
  defaultRadius?: number;
  compact?: boolean;
  className?: string;
}

export default function NearMeFilter({
  onRadiusChange,
  onLocationChange,
  defaultRadius = 10,
  compact = false,
  className = ''
}: NearMeFilterProps) {
  const [radius, setRadius] = useState(defaultRadius);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isActive, setIsActive] = useState(false);

  const radiusOptions = [
    { value: 5, label: '5 miles' },
    { value: 10, label: '10 miles' },
    { value: 15, label: '15 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: -1, label: 'All US Stores' }
  ];

  const handleLocationUpdate = (coordinates: { lat: number; lng: number }) => {
    setUserLocation(coordinates);
    setIsActive(true);
    if (onLocationChange) {
      onLocationChange(coordinates);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (onRadiusChange) {
      onRadiusChange(newRadius);
    }
  };

  const clearFilter = () => {
    setUserLocation(null);
    setIsActive(false);
    if (onLocationChange) {
      onLocationChange(null);
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg ${className}`}>
        <MapPin className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">Near Me:</span>
        
        {isActive ? (
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-100 text-teal-800">
              {radius === -1 ? 'All US Stores' : `Within ${radius} miles`}
            </Badge>
            <Button size="sm" variant="ghost" onClick={clearFilter}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <LocationButton
            onLocationUpdate={handleLocationUpdate}
            variant="ghost"
            size="sm"
          />
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-teal-600" />
          Near Me Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Find stores and businesses near your location
            </p>
            <LocationButton
              onLocationUpdate={handleLocationUpdate}
              variant="default"
              size="default"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">
                <MapPin className="w-3 h-3 mr-1" />
                Location Active
              </Badge>
              <Button size="sm" variant="ghost" onClick={clearFilter}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Search Radius</label>
              
              {/* Slider for radius (only show if not "All" mode) */}
              {radius !== -1 && (
                <div className="space-y-2">
                  <Slider
                    value={[radius]}
                    onValueChange={(value) => handleRadiusChange(value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 mile</span>
                    <span className="font-medium">{radius} miles</span>
                    <span>50 miles</span>
                  </div>
                </div>
              )}

              {/* Quick select buttons */}
              <div className="grid grid-cols-2 gap-2">
                {radiusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={radius === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRadiusChange(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                {radius === -1 
                  ? 'Showing all brick-and-mortar stores across the continental US'
                  : `Showing businesses within ${radius} miles of your location`
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}