import { MantineProvider } from '@mantine/core';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom } from '../stores/auth.stores';
import { Register } from '../pages/Auth/Register';
import { Login } from '../pages/Auth/Login';
import { DocumentsList } from '../pages/Documents/DocumentsList';
import { DocumentEditor } from '../pages/Documents/DocumentEditor';

export function App() {
  const [isLoggedIn] = useAtom(isAuthenticatedAtom);
  console.log(isLoggedIn);

  return (
    <div>
      <MantineProvider>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/documents" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/new" element={<DocumentEditor />} />
          <Route path="/documents/:id/edit" element={<DocumentEditor />} />
        </Routes>
      </MantineProvider>
    </div>
  );
}

export default App;
