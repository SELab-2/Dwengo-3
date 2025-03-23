import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Component to protect routes that require authentication
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth(); // Get user data from the context

  // If user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
