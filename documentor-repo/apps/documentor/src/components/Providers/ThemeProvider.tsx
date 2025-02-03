//
//  ThemeProvider.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 03.02.2025
//

import { MantineProvider } from '@mantine/core';
// import '@mantine/core/styles.layer.css';
import '@mantine/core/styles.css';
import { PropsWithChildren } from 'react';
import { DEFAULT_THEME } from '@mantine/core';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <MantineProvider
      withCssVariables={true}
      defaultColorScheme="light"
      theme={DEFAULT_THEME}
    >
      {children}
    </MantineProvider>
  );
};
