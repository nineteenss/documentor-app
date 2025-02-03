//
//  Providers.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 03.02.2025
//

import { ThemeProvider } from './ThemeProvider';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const AppProvider = ({ children }: React.PropsWithChildren<unknown>) => (
  <JotaiProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  </JotaiProvider>
);
