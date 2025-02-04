//
//  api.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

// Base URL for backend API
export const BASE_URL = 'http://localhost:3000'