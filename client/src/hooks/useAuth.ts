import { useMutation } from '@tanstack/react-query';
import apiClient from '../api';
import { LoginData, RegisterData, UserData } from '../util/types/auth.types';
import { ClassRoleEnum } from '../util/types/class.types';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Custom hook to access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      if (data.role === ClassRoleEnum.STUDENT) {
        const response = await apiClient.put('/api/auth/student/register', data);
        return response.data;
      } else {
        const response = await apiClient.put('/api/auth/teacher/register', data);
        return response.data;
      }
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      if (data.role === ClassRoleEnum.STUDENT) {
        const response = await apiClient.post('/api/auth/student/login', data);
        return response.data;
      } else {
        const response = await apiClient.post('/api/auth/teacher/login', data);
        return response.data;
      }
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async (data: UserData) => {
      if (data.role === ClassRoleEnum.STUDENT) {
        const response = await apiClient.post('/api/auth/student/logout');
        return response.data;
      } else {
        const response = await apiClient.post('/api/auth/teacher/logout');
        return response.data;
      }
    },
  });
}
