import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationFilter {
  type: 'all' | 'zip' | 'city' | 'state' | 'mall';
  value: string;
  displayName: string;
}

interface LocationStore {
  currentLocation: LocationFilter;
  mallContext: {
    mallId: string | null;
    mallName: string | null;
    isActive: boolean;
  };
  searchPreferences: {
    maxDistance: number;
    sortBy: 'distance' | 'relevance' | 'alphabetical';
    useGeolocation: boolean;
    currentZipCode: string | null;
  };
  setLocationFilter: (filter: LocationFilter) => void;
  setMallContext: (mallId: string, mallName: string) => void;
  clearMallContext: () => void;
  resetFilters: () => void;
  setSearchPreferences: (preferences: Partial<LocationStore['searchPreferences']>) => void;
  getNearbyLocations: (userZip?: string) => any[];
}

// Comprehensive nationwide location data for smart search
export const locationSuggestions = {
  malls: [
    // Minnesota
    { id: 'mall-1', name: 'Mall of America', city: 'Bloomington', state: 'MN', zipCode: '55425' },
    { id: 'mall-2', name: 'Ridgedale Mall', city: 'Minnetonka', state: 'MN', zipCode: '55305' },
    { id: 'mall-3', name: 'Southdale Center', city: 'Edina', state: 'MN', zipCode: '55435' },
    { id: 'mall-4', name: 'Rosedale Center', city: 'Roseville', state: 'MN', zipCode: '55113' },
    // California
    { id: 'mall-5', name: 'Beverly Center', city: 'Los Angeles', state: 'CA', zipCode: '90048' },
    { id: 'mall-6', name: 'Stanford Shopping Center', city: 'Palo Alto', state: 'CA', zipCode: '94304' },
    { id: 'mall-7', name: 'Westfield Valley Fair', city: 'Santa Clara', state: 'CA', zipCode: '95050' },
    // New York
    { id: 'mall-8', name: 'Westfield World Trade Center', city: 'New York', state: 'NY', zipCode: '10007' },
    { id: 'mall-9', name: 'Roosevelt Field', city: 'Garden City', state: 'NY', zipCode: '11530' },
    { id: 'mall-10', name: 'Queens Center', city: 'Elmhurst', state: 'NY', zipCode: '11373' },
    // Texas
    { id: 'mall-11', name: 'Galleria Dallas', city: 'Dallas', state: 'TX', zipCode: '75240' },
    { id: 'mall-12', name: 'Highland Mall', city: 'Austin', state: 'TX', zipCode: '78752' },
    { id: 'mall-13', name: 'The Galleria', city: 'Houston', state: 'TX', zipCode: '77056' },
    // Florida
    { id: 'mall-14', name: 'Aventura Mall', city: 'Aventura', state: 'FL', zipCode: '33180' },
    { id: 'mall-15', name: 'Town Center at Boca Raton', city: 'Boca Raton', state: 'FL', zipCode: '33431' },
    { id: 'mall-16', name: 'International Plaza', city: 'Tampa', state: 'FL', zipCode: '33607' },
    // Illinois
    { id: 'mall-17', name: 'Water Tower Place', city: 'Chicago', state: 'IL', zipCode: '60611' },
    { id: 'mall-18', name: 'Woodfield Mall', city: 'Schaumburg', state: 'IL', zipCode: '60173' },
    // More major malls nationwide
    { id: 'mall-19', name: 'King of Prussia Mall', city: 'King of Prussia', state: 'PA', zipCode: '19406' },
    { id: 'mall-20', name: 'South Coast Plaza', city: 'Costa Mesa', state: 'CA', zipCode: '92626' }
  ],
  cities: [
    // Major cities nationwide
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle',
    'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City',
    'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee',
    // Minnesota cities
    'Minneapolis', 'Saint Paul', 'Rochester', 'Bloomington', 'Duluth', 'Brooklyn Park',
    'Plymouth', 'Saint Cloud', 'Eagan', 'Woodbury', 'Maple Grove', 'Eden Prairie',
    'Coon Rapids', 'Burnsville', 'Minnetonka', 'Blaine', 'Lakeville', 'Roseville'
  ],
  states: [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
    'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 
    'VA', 'WA', 'WV', 'WI', 'WY'
  ],
  zipCodes: [
    // Major metro zip codes
    '10001', '10002', '10003', '10004', '10005', // NYC
    '90210', '90211', '90212', '90213', '90069', // LA
    '60601', '60602', '60603', '60604', '60605', // Chicago
    '77001', '77002', '77003', '77004', '77005', // Houston
    '85001', '85002', '85003', '85004', '85005', // Phoenix
    '19101', '19102', '19103', '19104', '19105', // Philadelphia
    // Minnesota zip codes
    '55401', '55402', '55403', '55404', '55405', '55406', '55407', '55408',
    '55101', '55102', '55103', '55104', '55105', '55106', '55107', '55108',
    '55344', '55345', '55424', '55425', '55435', '55305', '55113', '55337'
  ],
  maxDistanceOptions: [
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' },
    { value: 250, label: '250 miles' },
    { value: 1000, label: 'Nationwide' }
  ]
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      currentLocation: {
        type: 'all',
        value: '',
        displayName: 'All Locations'
      },
      mallContext: {
        mallId: null,
        mallName: null,
        isActive: false
      },
      searchPreferences: {
        maxDistance: 50,
        sortBy: 'distance',
        useGeolocation: false,
        currentZipCode: null
      },
      setLocationFilter: (filter) => {
        set({ currentLocation: filter });
        
        // If setting a mall filter, activate mall context
        if (filter.type === 'mall') {
          const mall = locationSuggestions.malls.find(m => m.name === filter.value);
          if (mall) {
            set({
              mallContext: {
                mallId: mall.id,
                mallName: mall.name,
                isActive: true
              }
            });
          }
        } else {
          // Clear mall context for non-mall filters
          set({
            mallContext: {
              mallId: null,
              mallName: null,
              isActive: false
            }
          });
        }
      },
      setMallContext: (mallId, mallName) => {
        set({
          mallContext: {
            mallId,
            mallName,
            isActive: true
          },
          currentLocation: {
            type: 'mall',
            value: mallName,
            displayName: mallName
          }
        });
      },
      clearMallContext: () => {
        set({
          mallContext: {
            mallId: null,
            mallName: null,
            isActive: false
          },
          currentLocation: {
            type: 'all',
            value: '',
            displayName: 'All Locations'
          }
        });
      },
      resetFilters: () => {
        set({
          currentLocation: {
            type: 'all',
            value: '',
            displayName: 'All Locations'
          },
          mallContext: {
            mallId: null,
            mallName: null,
            isActive: false
          }
        });
      },
      setSearchPreferences: (preferences) => {
        set(state => ({
          searchPreferences: { ...state.searchPreferences, ...preferences }
        }));
      },
      getNearbyLocations: (userZip) => {
        const { searchPreferences } = get();
        const zip = userZip || searchPreferences.currentZipCode;
        
        if (!zip) return locationSuggestions.malls;
        
        // Simple distance calculation based on zip code proximity
        // In a real app, this would use actual geo-coordinates
        return locationSuggestions.malls
          .map(mall => ({
            ...mall,
            distance: Math.abs(parseInt(zip) - parseInt(mall.zipCode)) / 1000 // Simplified distance
          }))
          .filter(mall => mall.distance <= searchPreferences.maxDistance)
          .sort((a, b) => {
            switch (searchPreferences.sortBy) {
              case 'distance':
                return a.distance - b.distance;
              case 'alphabetical':
                return a.name.localeCompare(b.name);
              default:
                return 0;
            }
          });
      }
    }),
    {
      name: 'spiral-location-store',
      partialize: (state) => ({
        currentLocation: state.currentLocation,
        mallContext: state.mallContext,
        searchPreferences: state.searchPreferences
      })
    }
  )
);