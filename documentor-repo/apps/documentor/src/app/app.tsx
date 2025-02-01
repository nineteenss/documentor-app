import { MantineProvider } from '@mantine/core';
import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import DocumentsList from '../pages/Documents/DocumentsList';

export function App() {
  return (
    <div>
      <MantineProvider>
        <Routes>
          <Route path="/" element={<DocumentsList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MantineProvider>
    </div>
  );
}

export default App;
