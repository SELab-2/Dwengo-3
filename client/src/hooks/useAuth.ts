import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { LoginData, RegisterData } from '../util/interfaces/auth.interfaces';
import { ClassRoleEnum } from '../util/interfaces/class.interfaces';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiRoutes } from '../api/api.routes';

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
        const response = await apiClient.put(ApiRoutes.register.student, data);
        return response.data;
      } else {
        const response = await apiClient.put(ApiRoutes.register.teacher, data);
        return response.data;
      }
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      if (data.role === ClassRoleEnum.STUDENT) {
        const response = await apiClient.post(ApiRoutes.login.student, data);
        return response.data;
      } else {
        const response = await apiClient.post(ApiRoutes.login.teacher, data);
        return response.data;
      }
    },
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async (userRole: ClassRoleEnum) => {
      if (userRole === ClassRoleEnum.STUDENT) {
        const response = await apiClient.get(ApiRoutes.login.google.student);
        return response.data;
      } else {
        const response = await apiClient.get(ApiRoutes.login.google.teacher);
        return response.data;
      }
    },
  });
}

export function useLogout() {
  // TODO: other logout method
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(ApiRoutes.logout);
      return response.data;
    },
  });
}
