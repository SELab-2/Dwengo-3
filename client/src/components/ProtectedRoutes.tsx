import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Component that renders child routes if authenticated, otherwise redirects to login
 */
function ProtectedRoutes() {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render child routes if authenticated
}

export default ProtectedRoutes;
