import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  email: string;
  name: string;
  loginTime: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      logout: async () => {
        try {
          // Call backend to clear session cookie
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Always clear local state
          set({ user: null, isAuthenticated: false });
        }
      },
      
      checkSession: async () => {
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              set({ 
                user: {
                  email: data.user.email,
                  name: data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || 'User',
                  loginTime: new Date().toISOString()
                }, 
                isAuthenticated: true 
              });
            }
          } else {
            // Invalid session, clear local state
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Session check error:', error);
          set({ user: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'spiral-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);