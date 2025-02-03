//
//  auth.stores.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export interface User {
  id: string; // Unique identifier for the user
  username: string; // Username of the user
}

// Atoms to store username and password inputs
export const usernameAtom = atom<string>('')
export const passwordAtom = atom<string>('')

// Atom to store userId in session storage for current session
// const storage = createJSONStorage(() => localStorage)
export const isAuthenticatedAtom = atomWithStorage<boolean>('isAuthenticated', false)
export const userIdAtom = atomWithStorage<string | null>('userId', null)

export const loginAtom = atom(null, (get, set, userId: string) => {
  set(userIdAtom, userId)
  set(isAuthenticatedAtom, true)
})

export const logoutAtom = atom(null, (get, set) => {
  set(userIdAtom, null)
  set(isAuthenticatedAtom, false)
})

// Atom to store the current user
// export const userAtom = atom<User | null>(null)

// Derived atom to check if the user is authenticated
// export const isAuthenticatedAtom = atom((get) => {
//   const userId = get(userIdAtom)
//   return !!userId
// })