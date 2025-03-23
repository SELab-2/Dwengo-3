import { useMutation } from '@tanstack/react-query';
import apiClient from '../api';
import { LoginData, RegisterData } from '../util/types/auth.types';
import { ClassRoleEnum } from '../util/types/class.types';

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      if (data.role === ClassRoleEnum.STUDENT) {
        const response = await apiClient.put(
          '/api/auth/student/register',
          data,
        );
        return response.data;
      } else {
        const response = await apiClient.put(
          '/api/auth/teacher/register',
          data,
        );
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
