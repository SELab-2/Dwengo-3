import { createContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType } from '../util/types/auth.types';
import { UserDetail } from '../util/types/user.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDetail | null>(null);

  // Load user from local storage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  // Save user to local storage
  const login = (userData: UserDetail) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Save user to local storage
  const register = (userData: UserDetail) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Remove user from local storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
