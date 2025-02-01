//
//  auth.stores.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { atom } from 'jotai'

// Atom to store the current user
export const userAtom = atom<{
  username: string,
  _id: string
} | null>(null)

// Atom to store authenticaiton status
// Convert a value to a boolean (!!)
export const isAuthenticatedAtom = atom((get) => !!get(userAtom))