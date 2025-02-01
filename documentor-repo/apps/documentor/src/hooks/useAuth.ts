//
//  useAuth.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useMutation, useQuery } from '@tanstack/react-query'
import { BASE_URL } from '../lib/api'
import { userAtom, userIdAtom, isAuthenticatedAtom } from '../stores/auth.stores'
import { useAtom } from 'jotai'

// export function useUserId() {
//   const [user] = useAtom(userAtom);
//   return user?.id || null; // Return the user ID or null if no user is logged in
// }

export function useAuth() {

  interface AuthCredentials {
    username: string;
    password: string;
  }

  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isAuthenticatedAtom);
  const [userId, setUserId] = useAtom(userIdAtom)

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
      setUser(data);
      setUserId(data._id) // Replaced 'id' with '_id' to start receiving correct data
      // console.log('data.id:', data._id)
      setIsLoggedIn(true);
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
      setUser(data);
      setUserId(data._id) // Replaced 'id' with '_id' to start receiving correct data
      setIsLoggedIn(true);
    },
  });

  // Logout logic
  const logout = () => {
    setUser(null);
    setUserId('')
    setIsLoggedIn(false);
  };

  return { loginMutation, registerMutation, logout };
}