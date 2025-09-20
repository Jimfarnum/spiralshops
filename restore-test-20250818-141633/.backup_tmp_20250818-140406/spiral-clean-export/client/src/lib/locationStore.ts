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
    // Major metro zip codes - New York
    '10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010',
    '10011', '10012', '10013', '10014', '10015', '10016', '10017', '10018', '10019', '10020',
    '10021', '10022', '10023', '10024', '10025', '10026', '10027', '10028', '10029', '10030',
    // Los Angeles
    '90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010',
    '90210', '90211', '90212', '90213', '90214', '90215', '90069', '90048', '90036', '90028',
    // Chicago
    '60601', '60602', '60603', '60604', '60605', '60606', '60607', '60608', '60609', '60610',
    '60611', '60612', '60613', '60614', '60615', '60616', '60617', '60618', '60619', '60620',
    // Houston
    '77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010',
    '77011', '77012', '77013', '77014', '77015', '77016', '77017', '77018', '77019', '77020',
    // Phoenix
    '85001', '85002', '85003', '85004', '85005', '85006', '85007', '85008', '85009', '85010',
    '85011', '85012', '85013', '85014', '85015', '85016', '85017', '85018', '85019', '85020',
    // Philadelphia
    '19101', '19102', '19103', '19104', '19105', '19106', '19107', '19108', '19109', '19110',
    '19111', '19112', '19113', '19114', '19115', '19116', '19117', '19118', '19119', '19120',
    // Dallas
    '75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210',
    '75211', '75212', '75213', '75214', '75215', '75216', '75217', '75218', '75219', '75220',
    // Miami
    '33101', '33102', '33103', '33104', '33105', '33106', '33107', '33108', '33109', '33110',
    '33111', '33112', '33113', '33114', '33115', '33116', '33117', '33118', '33119', '33120',
    // Atlanta
    '30301', '30302', '30303', '30304', '30305', '30306', '30307', '30308', '30309', '30310',
    '30311', '30312', '30313', '30314', '30315', '30316', '30317', '30318', '30319', '30320',
    // Boston
    '02101', '02102', '02103', '02104', '02105', '02106', '02107', '02108', '02109', '02110',
    '02111', '02112', '02113', '02114', '02115', '02116', '02117', '02118', '02119', '02120',
    // San Francisco
    '94101', '94102', '94103', '94104', '94105', '94106', '94107', '94108', '94109', '94110',
    '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94121', '94122', '94123',
    // Seattle
    '98101', '98102', '98103', '98104', '98105', '98106', '98107', '98108', '98109', '98110',
    '98111', '98112', '98113', '98114', '98115', '98116', '98117', '98118', '98119', '98121',
    // Denver
    '80201', '80202', '80203', '80204', '80205', '80206', '80207', '80208', '80209', '80210',
    '80211', '80212', '80213', '80214', '80215', '80216', '80217', '80218', '80219', '80220',
    // Minnesota zip codes
    '55401', '55402', '55403', '55404', '55405', '55406', '55407', '55408', '55409', '55410',
    '55101', '55102', '55103', '55104', '55105', '55106', '55107', '55108', '55109', '55110',
    '55344', '55345', '55424', '55425', '55435', '55305', '55113', '55337', '55316', '55364'
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