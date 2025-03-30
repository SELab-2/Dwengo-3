import { useQuery } from '@tanstack/react-query';
import apiClient from '../api';
import { ApiRoutes } from '../util/routes';

/**
 * Fetches the list of students for the given parameters.
 *
 * @param userId - The ID of the user whose student data needs to be fetched.
 * @param classId - The ID of the class to filter the students.
 * @param groupId - The ID of the group to filter the students.
 * @returns
 */
export function useStudent(userId?: string, classId?: string, groupId?: string) {
  return useQuery({
    queryKey: ['student', userId],
    queryFn: async () => {
      const response = await apiClient.get(ApiRoutes.student.list, {
        params: {
          userId,
          classId,
          groupId,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches the list of teachers for the given parameters.
 *
 * @param userId - The ID of the user whose teacher data needs to be fetched.
 * @classId - The ID of the class to filter the teacher.
 * @groupId - The ID of the group to filter the teacher.
 * @returns The query object containing the teacher data.
 */
export function useTeacher(userId?: string, classId?: string, groupId?: string) {
  return useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      const response = await apiClient.get(ApiRoutes.teacher.list, {
        params: {
          userId,
          classId,
          groupId,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}
