//
//  Login.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 31.01.2025
//

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Center, Text } from '@mantine/core';
import { useAtom } from 'jotai';
import { useAuth } from '../../hooks/useAuth';
import {
  passwordAtom,
  usernameAtom,
  isAuthenticatedAtom,
  userAtom,
} from '../../stores/auth.stores';

export function Login() {
  // Using Jotai atoms for username and password
  const [username, setUsername] = useAtom(usernameAtom);
  const [password, setPassword] = useAtom(passwordAtom);

  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUser] = useAtom(userAtom);
  const { loginMutation } = useAuth();
  const navigate = useNavigate();

  // Resetting atoms in case somehow returned to login page
  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [setUsername, setPassword]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const username = formData.get('username') as string;
    // const password = formData.get('password') as string;

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          setUser(data); // Update the user atom
          setIsAuthenticated(true); // Update authentication status
          setUsername('');
          setPassword('');
          navigate('/documents');
        },
      }
    );
  };

  return (
    <Center style={{ height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: 300 }}>
        <TextInput
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          label="Username"
          required
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          label="Password"
          required
          mt="sm"
        />
        <Button type="submit" fullWidth mt="md">
          Login
        </Button>
        <Text mt="md">
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'blue' }}>
            Register now
          </a>
        </Text>
      </form>
    </Center>
  );
}
