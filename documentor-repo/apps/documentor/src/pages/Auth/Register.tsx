//
//  Register.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Title } from '@mantine/core';
import { atom, useAtom } from 'jotai';
import { userAtom } from '../../stores/auth.stores';

// Defining states as atoms
const usernameAtom = atom('');
const passwordAtom = atom('');

const Register = () => {
  const [username, setUsername] = useAtom(usernameAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom); // Use Jotai to manage user state

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data); // Update user state in Jotai
      navigate('/documents'); // Redirect to documents page
    },
  });

  return (
    <div>
      <Title>Register</Title>
      <TextInput
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={() => registerMutation.mutate()}>Register</Button>
    </div>
  );
};

export default Register;
