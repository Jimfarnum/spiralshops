// SPIRAL GPS and Location Services

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  accuracy?: number;
}

export interface StoreLocation extends LocationData {
  id: string;
  name: string;
  category: string;
  distance?: number; // in miles
}

export class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Get user's current location
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          const locationData: LocationData = {
            coordinates: coords,
            accuracy: position.coords.accuracy
          };

          // Get address details using reverse geocoding
          try {
            const addressData = await this.reverseGeocode(coords);
            locationData.address = addressData.address;
            locationData.city = addressData.city;
            locationData.state = addressData.state;
            locationData.zipCode = addressData.zipCode;
          } catch (error) {
            console.warn('Failed to reverse geocode:', error);
          }

          this.currentLocation = locationData;
          resolve(locationData);
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // Cache for 1 minute
        }
      );
    });
  }

  // Watch user location for real-time updates
  watchLocation(callback: (location: LocationData) => void): number {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported');
    }

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        const locationData: LocationData = {
          coordinates: coords,
          accuracy: position.coords.accuracy
        };

        try {
          const addressData = await this.reverseGeocode(coords);
          locationData.address = addressData.address;
          locationData.city = addressData.city;
          locationData.state = addressData.state;
          locationData.zipCode = addressData.zipCode;
        } catch (error) {
          console.warn('Failed to reverse geocode:', error);
        }

        this.currentLocation = locationData;
        callback(locationData);
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000
      }
    );

    return this.watchId;
  }

  // Stop watching location
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(coord2.latitude - coord1.latitude);
    const dLon = this.toRad(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.latitude)) * Math.cos(this.toRad(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  // Reverse geocoding to get address from coordinates
  private async reverseGeocode(coords: Coordinates): Promise<{
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }> {
    try {
      // Using a free geocoding service (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data = await response.json();
      const address = data.address || {};
      
      return {
        address: data.display_name || 'Unknown address',
        city: address.city || address.town || address.village || 'Unknown city',
        state: address.state || 'Unknown state',
        zipCode: address.postcode || 'Unknown ZIP'
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Forward geocoding - get coordinates from address
  async geocodeAddress(address: string): Promise<Coordinates> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Address not found');
      }
      
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } catch (error) {
      console.error('Forward geocoding error:', error);
      throw error;
    }
  }

  // Calculate distances for multiple stores
  calculateStoreDistances(stores: any[], userLocation: Coordinates): any[] {
    return stores.map(store => {
      if (store.coordinates) {
        const distance = this.calculateDistance(userLocation, store.coordinates);
        return {
          ...store,
          distance: distance,
          distanceText: `${distance} mi`
        };
      }
      return store;
    }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  }

  // Get cached location
  getCachedLocation(): LocationData | null {
    return this.currentLocation;
  }

  // Request location permission
  async requestLocationPermission(): Promise<boolean> {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state === 'granted';
    } catch (error) {
      // Fallback: try to get location directly
      try {
        await this.getCurrentLocation();
        return true;
      } catch {
        return false;
      }
    }
  }
}

export const locationService = LocationService.getInstance();