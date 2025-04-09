import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/api';
import { ApiRoutes } from '../api/api.routes';

/**
 * Fetches a list of classes based on the provided student and teacher IDs.
 *
 * @param studentId - The ID of the student whose classes are to be fetched.
 * @param teacherId - The ID of the teacher whose classes are to be fetched.
 * @returns The query object containing the class data.
 */
export function useClass(studentId?: string, teacherId?: string) {
  return useQuery({
    queryKey: ['class', studentId, teacherId],
    queryFn: async () => {
      const response = await apiClient.get(ApiRoutes.class.list, {
        params: {
          studentId,
          teacherId,
        },
      });
      return response.data;
    },
    enabled: !!studentId || !!teacherId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a class by its ID.
 *
 * @param classId - The ID of the class to be fetched.
 * @returns The query object containing the class data.
 */
export function useClassById(classId: string) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      const response = await apiClient.get(ApiRoutes.class.get(classId));
      return response.data;
    },
    enabled: !!classId,
    refetchOnWindowFocus: false,
  });
}
