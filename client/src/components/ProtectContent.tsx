import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppRoutes, PublicRoutes } from '../util/app.routes';

/**
 * Component that protects content by checking authentication status.
 * Renders children if authenticated or on public routes.
 */
function ProtectContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (PublicRoutes.includes(location.pathname)) {
    return <>{children}</>; // Render children if on public routes
  }

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to={AppRoutes.login} replace />;
  }

  return <>{children}</>; // Render children if authenticated
}

export default ProtectContent;
