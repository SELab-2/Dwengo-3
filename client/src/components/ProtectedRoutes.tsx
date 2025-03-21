import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
  // TODO: Implement authentication logic
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render child routes if authenticated
}

export default ProtectedRoutes;
