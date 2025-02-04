//
//  useAuth.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useMutation } from '@tanstack/react-query'
import { BASE_URL } from '../lib/api'
import { userIdAtom, isAuthenticatedAtom, loginAtom, logoutAtom } from '../stores/auth.stores'
import { useAtom } from 'jotai'

export function useAuth() {
  interface AuthCredentials {
    username: string;
    password: string;
  }

  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userId] = useAtom(userIdAtom)
  const [, login] = useAtom(loginAtom)
  const [, logout] = useAtom(logoutAtom)

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: AuthCredentials) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    onSuccess: (data) => {
      // setUserId(data._id) // Replaced 'id' with '_id' to start receiving correct data
      login(data._id)
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: AuthCredentials) => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    },
    onSuccess: (data) => {
      // setUserId(data._id) // Replaced 'id' with '_id' to start receiving correct data
      login(data._id)
    },
  });

  // Logout logic
  // const logout = () => {
  //   setUserId(null)
  // };

  return {
    userId,
    loginMutation,
    registerMutation,
    logout,
    isAuthenticated
  };
}