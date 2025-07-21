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
  setLocationFilter: (filter: LocationFilter) => void;
  setMallContext: (mallId: string, mallName: string) => void;
  clearMallContext: () => void;
  resetFilters: () => void;
}

// Mock data for location suggestions
export const locationSuggestions = {
  malls: [
    { id: 'mall-1', name: 'Ridgedale Mall', city: 'Minnetonka', state: 'MN' },
    { id: 'mall-2', name: 'Mall of America', city: 'Bloomington', state: 'MN' },
    { id: 'mall-3', name: 'Southdale Center', city: 'Edina', state: 'MN' },
    { id: 'mall-4', name: 'Rosedale Center', city: 'Roseville', state: 'MN' },
    { id: 'mall-5', name: 'Burnsville Center', city: 'Burnsville', state: 'MN' },
    { id: 'mall-6', name: 'Brookdale Shopping Center', city: 'Brooklyn Center', state: 'MN' }
  ],
  cities: [
    'Minneapolis', 'Saint Paul', 'Bloomington', 'Minnetonka', 'Edina', 
    'Roseville', 'Burnsville', 'Brooklyn Center', 'Plymouth', 'Maple Grove'
  ],
  states: [
    'MN', 'WI', 'IA', 'ND', 'SD'
  ],
  zipCodes: [
    '55401', '55402', '55403', '55404', '55405', '55406', '55407', '55408',
    '55344', '55345', '55424', '55425', '55113', '55112', '55337', '55429'
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
      }
    }),
    {
      name: 'spiral-location-store',
      partialize: (state) => ({
        currentLocation: state.currentLocation,
        mallContext: state.mallContext
      })
    }
  )
);