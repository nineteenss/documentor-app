import { AppProvider } from '../components/Providers/Providers';
import { ProtectedRoute } from '../components/Protected/ProtectedRoutes';
import { Routes, Route } from 'react-router-dom';
import { Register } from '../pages/Auth/Register';
import { Login } from '../pages/Auth/Login';
import { DocumentsList } from '../pages/Documents/DocumentsList';
import { DocumentEditor } from '../pages/Documents/DocumentEditor';

export function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DocumentsList />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/new" element={<DocumentEditor />} />
          <Route path="/documents/:id/edit" element={<DocumentEditor />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
