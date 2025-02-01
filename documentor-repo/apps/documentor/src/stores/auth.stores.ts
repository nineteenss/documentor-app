//
//  auth.stores.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { atom } from 'jotai'

export interface User {
  id: string; // Unique identifier for the user
  username: string; // Username of the user
}

// Atoms to store username and password inputs
export const usernameAtom = atom<string>('')
export const passwordAtom = atom<string>('')

// Atom to store userId
export const userIdAtom = atom<string>('')

// Atom to store the current user
export const userAtom = atom<User | null>(null)

// Atom to store authenticaiton status
export const isAuthenticatedAtom = atom<boolean>(false)