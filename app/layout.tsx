import './globals.css';
import Header from './component/header';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import { SearchStateProvider } from './component/searchcontext';
import { UserStateProvider } from './component/usercontext';
import { ItineraryStateProvider } from './component/tripcontext';

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};

export const metadata = {
  title: 'Travel planner',
  description: 'A travel planning website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <UserStateProvider>
            <Header />
              <main>             
                <SearchStateProvider>
                  <ItineraryStateProvider>
                  {children}
                  </ItineraryStateProvider>
                </SearchStateProvider>              
              </main>   
            </UserStateProvider>         
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
