import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppRoutes } from '../util/app.routes';
import { Box, CircularProgress } from '@mui/material';

const publicRoutes = [AppRoutes.login, AppRoutes.register];

/**
 * Component that protects content by checking authentication status.
 * Renders children if authenticated or on public routes.
 */
function ProtectContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (publicRoutes.includes(location.pathname)) {
    return <>{children}</>; // Render children if on public routes
  }

  // Show a loading spinner while authentication status is being resolved
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={AppRoutes.login} replace />;
  }

  return <>{children}</>; // Render children if authenticated
}

export default ProtectContent;
