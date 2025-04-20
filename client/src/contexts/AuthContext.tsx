import { createContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType } from '../util/interfaces/auth.interfaces';
import { UserDetail } from '../util/interfaces/user.interfaces';
import apiClient from '../api/apiClient';
import { ApiRoutes } from '../api/api.routes';
import { useLocation } from 'react-router-dom';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if the user is logged in
    const excludedRoutes = ['/login', '/register'];

    // Fetch user info when the component mounts
    if (!excludedRoutes.includes(location.pathname)) {
      const fetchUser = async () => {
        try {
          const response = await apiClient.get(ApiRoutes.me); // Backend endpoint to fetch user info
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };

      fetchUser();
    }
  }, []);

  const login = (userData: UserDetail) => {
    // Set user in context
    setUser(userData);
  };

  const register = (userData: UserDetail) => {
    // Set user in context
    setUser(userData);
  };

  const logout = () => {
    // Clear user from context
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
