'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

type ProfileMode = 'customer' | 'worker';

interface ProfileModeContextType {
   mode: ProfileMode;
}

const ProfileModeContext = createContext<ProfileModeContextType | undefined>(
   undefined
);

interface ProfileModeProviderProps {
   children: ReactNode;
   mode: ProfileMode;
}

const THEME_COLORS = {
   customer: {
      '--primary': 'oklch(0.398 0.195 277.366)', // Purple
      '--primary-foreground': 'oklch(0.962 0.018 272.314)',
   },
   worker: {
      '--primary': '#f8c617', // Yellow
      '--primary-foreground': '#1a1a1a',
   },
};

export function ProfileModeProvider({
   children,
   mode,
}: ProfileModeProviderProps) {
   useEffect(() => {
      const root = document.documentElement;
      const colors = THEME_COLORS[mode];

      // Apply theme colors
      Object.entries(colors).forEach(([key, value]) => {
         root.style.setProperty(key, value);
      });

      // Cleanup: reset to customer theme when unmounting
      return () => {
         Object.entries(THEME_COLORS.customer).forEach(([key, value]) => {
            root.style.setProperty(key, value);
         });
      };
   }, [mode]);

   return (
      <ProfileModeContext.Provider value={{ mode }}>
         {children}
      </ProfileModeContext.Provider>
   );
}

export function useProfileMode() {
   const context = useContext(ProfileModeContext);
   if (context === undefined) {
      throw new Error(
         'useProfileMode must be used within a ProfileModeProvider'
      );
   }
   return context;
}
