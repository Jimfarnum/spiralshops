/**
 * Calculate distance between two geographic points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in miles
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

/**
 * Format distance for display
 * @param distance Distance in miles
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 0.1) {
    return '< 0.1 mi';
  } else if (distance < 1) {
    return `${distance.toFixed(1)} mi`;
  } else {
    return `${distance.toFixed(1)} mi`;
  }
}

/**
 * Get directions URL for Google Maps
 * @param lat Destination latitude
 * @param lng Destination longitude
 * @param address Optional address for better routing
 * @returns Google Maps directions URL
 */
export function getDirectionsUrl(lat: number, lng: number, address?: string): string {
  const destination = address 
    ? encodeURIComponent(address)
    : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}