'use client';

import { Toaster } from '@/components/ui/sonner';
import { AuthUserProvider } from '@/provider/auth-user.provider';
import { ThemeProvider } from '@/provider/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthUserProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthUserProvider>
      <Toaster position="bottom-center" richColors className="print:hidden" />
    </ThemeProvider>
  );
}

export default AppProvider;
