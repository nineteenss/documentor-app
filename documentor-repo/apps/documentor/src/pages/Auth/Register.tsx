//
//  Register.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

// apps/editor/src/pages/Auth/Register.tsx
import { TextInput, PasswordInput, Button, Center, Text } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  passwordAtom,
  usernameAtom,
  isAuthenticatedAtom,
  userAtom,
} from '../../stores/auth.stores';

export function Register() {
  // Using Jotai atoms for username and password
  const [username, setUsername] = useAtom(usernameAtom);
  const [password, setPassword] = useAtom(passwordAtom);

  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUser] = useAtom(userAtom);
  const { registerMutation } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const username = formData.get('username');
    // const password = formData.get('password');

    registerMutation.mutate(
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
          Register
        </Button>
        <Text mt="md">
          Already have an account?{' '}
          <a href="/login" style={{ color: 'blue' }}>
            Login now
          </a>
        </Text>
      </form>
    </Center>
  );
}
