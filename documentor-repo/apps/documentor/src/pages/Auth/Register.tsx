//
//  Register.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { TextInput, PasswordInput, Button, Center, Text } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import clsx from 'clsx';
import classes from '../pages.module.css';

export function Register() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  // const [, setUser] = useAtom(userAtom);
  const { registerMutation } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const username = formData.get('username');
    // const password = formData.get('password');

    registerMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          // setUser(data); // Update the user atom
          // setIsAuthenticated(true); // Update authentication status
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
        <Button type="submit" radius="md" fullWidth mt="md">
          Register
        </Button>
        <Text mt="md">
          Already have an account?{' '}
          <a href="/login" className={clsx(classes.color_blue)}>
            Login now
          </a>
        </Text>
      </form>
    </Center>
  );
}
