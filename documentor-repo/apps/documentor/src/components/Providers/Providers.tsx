//
//  Providers.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 03.02.2025
//

import { ThemeProvider } from './ThemeProvider';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/api';
import { PropsWithChildren } from 'react';

export const AppProvider = ({ children }: PropsWithChildren) => (
  <JotaiProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  </JotaiProvider>
);
