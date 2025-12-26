'use client';

import { Toaster } from '@/components/ui/sonner';
import { AuthUserProvider } from '@/provider/auth-user.provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthUserProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster position="bottom-center" richColors className="print:hidden" />
    </AuthUserProvider>
  );
}

export default AppProvider;
