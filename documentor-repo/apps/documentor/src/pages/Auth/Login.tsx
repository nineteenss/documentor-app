//
//  Login.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 31.01.2025
//

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Title } from '@mantine/core';
import { atom, useAtom } from 'jotai';
import { userAtom } from '../../stores/auth.stores';

// Defining states as atoms
const usernameAtom = atom('');
const passwordAtom = atom('');

const Login = () => {
  const [username, setUsername] = useAtom(usernameAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data);
      navigate('/documents');
    },
  });

  return (
    <div>
      <Title>Login</Title>
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
      <Button onClick={() => loginMutation.mutate()}>Login</Button>
    </div>
  );
};

export default Login;
