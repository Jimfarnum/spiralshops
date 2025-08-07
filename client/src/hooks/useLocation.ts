import { useState, useEffect } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
}

export function useLocation(): LocationState & {
  getCurrentLocation: () => Promise<Coordinates>;
  clearError: () => void;
} {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    loading: false,
    error: null,
    hasPermission: false
  });

  const getCurrentLocation = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        const error = 'Geolocation is not supported by this browser';
        setState(prev => ({ ...prev, error, loading: false }));
        reject(new Error(error));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setState(prev => ({
            ...prev,
            coordinates,
            loading: false,
            hasPermission: true,
            error: null
          }));
          
          resolve(coordinates);
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
            hasPermission: error.code !== error.PERMISSION_DENIED
          }));
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Auto-request location on mount if permission was previously granted
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          getCurrentLocation().catch(() => {
            // Silently handle errors on auto-request
          });
        }
      });
    }
  }, []);

  return {
    ...state,
    getCurrentLocation,
    clearError
  };
}