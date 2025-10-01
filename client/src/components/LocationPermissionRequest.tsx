import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react';
import { locationService, type LocationData } from '@/services/locationService';

interface LocationPermissionRequestProps {
  onLocationGranted: (location: LocationData) => void;
  onLocationDenied: () => void;
  showCard?: boolean;
}

export default function LocationPermissionRequest({ 
  onLocationGranted, 
  onLocationDenied,
  showCard = true 
}: LocationPermissionRequestProps) {
  const [permissionState, setPermissionState] = useState<'unknown' | 'requesting' | 'granted' | 'denied'>('unknown');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkExistingPermission();
  }, []);

  const checkExistingPermission = async () => {
    try {
      const hasPermission = await locationService.requestLocationPermission();
      if (hasPermission) {
        const cachedLocation = locationService.getCachedLocation();
        if (cachedLocation) {
          setLocation(cachedLocation);
          setPermissionState('granted');
          onLocationGranted(cachedLocation);
        }
      }
    } catch (error) {
      console.log('Permission check failed:', error);
    }
  };

  const requestLocation = async () => {
    setPermissionState('requesting');
    setError(null);

    try {
      const userLocation = await locationService.getCurrentLocation();
      setLocation(userLocation);
      setPermissionState('granted');
      onLocationGranted(userLocation);
    } catch (error) {
      console.error('Location request failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to get location');
      setPermissionState('denied');
      onLocationDenied();
    }
  };

  const LocationContent = () => (
    <>
      {permissionState === 'unknown' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <MapPin className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Find Stores Near You</h3>
            <p className="text-gray-600 mb-4">
              Allow location access to discover local stores and get accurate distances
            </p>
          </div>
          <Button onClick={requestLocation} className="w-full">
            <Navigation className="h-4 w-4 mr-2" />
            Enable Location Services
          </Button>
          <p className="text-xs text-gray-500">
            We use your location only to show nearby stores and calculate distances
          </p>
        </div>
      )}

      {permissionState === 'requesting' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Getting Your Location</h3>
            <p className="text-gray-600">Please allow location access in your browser</p>
          </div>
        </div>
      )}

      {permissionState === 'granted' && location && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-700">Location Enabled</h3>
            <p className="text-sm text-gray-600">
              {location.city && location.state ? `${location.city}, ${location.state}` : 'Location detected'}
            </p>
            {location.accuracy && (
              <p className="text-xs text-gray-500">
                Accuracy: {Math.round(location.accuracy)}m
              </p>
            )}
          </div>
        </div>
      )}

      {permissionState === 'denied' && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p><strong>Location access denied</strong></p>
              {error && <p className="text-sm">{error}</p>}
              <p className="text-sm">
                You can still search stores manually by city or browse all locations.
                To enable location services later, click the location icon in your browser's address bar.
              </p>
              <Button 
                onClick={requestLocation} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );

  if (!showCard) {
    return <LocationContent />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Services
        </CardTitle>
        <CardDescription>
          Get personalized store recommendations based on your location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LocationContent />
      </CardContent>
    </Card>
  );
}