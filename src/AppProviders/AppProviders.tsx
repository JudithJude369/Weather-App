// src/components/AppProviders.tsx
import { ThemeProvider } from "@/contexts/theme-provider";
import React from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
    </ThemeProvider>
  );
}

// src/components/AppProviders.tsx
// import React from 'react';
// import { ThemeProvider } from '../context/ThemeContext';
// import { SearchProvider } from '../context/SearchContext';

// export function AppProviders({ children }: { children: React.ReactNode }) {
//   return (
//     <ThemeProvider>
//       <SearchProvider>
//         {children}
//       </SearchProvider>
//     </ThemeProvider>
//   );
// }
