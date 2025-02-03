//
//  ProtectedRoutes.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 03.02.2025
//

// import { useAtom } from 'jotai';
import { Navigate, Outlet } from 'react-router-dom';
// import { isAuthenticatedAtom } from '../../stores/auth.stores';

export function ProtectedRoute() {
  // Stopped reading from localStorage using Jotai since it does not fetch
  // the data before the page loaded, and for exact check I wanted statement
  // loaded before the page loaded
  // // const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // console.log('User not authenticated:', isAuthenticated);
    return <Navigate to="/login" />;
  }
  // console.log('User is authenticated:', isAuthenticated);
  return <Outlet />;
}
