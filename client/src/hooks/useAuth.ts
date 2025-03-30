import { useMutation } from '@tanstack/react-query';
import apiClient from '../api';
import { LoginData, RegisterData } from '../util/types/auth.types';
import { ClassRoleEnum } from '../util/types/class.types';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiRoutes } from '../util/routes';
import { UserDetail } from '../util/types/user.types';

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

export function useLogout() {
  return useMutation({
    mutationFn: async (data: UserDetail) => {
      if (data.role === ClassRoleEnum.STUDENT) {
        const response = await apiClient.post(ApiRoutes.logout.student);
        return response.data;
      } else {
        const response = await apiClient.post(ApiRoutes.logout.teacher);
        return response.data;
      }
    },
  });
}
