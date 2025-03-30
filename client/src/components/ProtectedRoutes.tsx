import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppRoutes } from '../util/routes';

/**
 * Component that renders child routes if authenticated, otherwise redirects to login
 */
function ProtectedRoutes() {
  const { user } = useAuth();

  // TODO: prevent flash of unauthenticated content

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={AppRoutes.login} replace />;
  }

  return <Outlet />; // Render child routes if authenticated
}

export default ProtectedRoutes;
