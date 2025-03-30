import { useQuery } from '@tanstack/react-query';
import apiClient from '../api';
import { ApiRoutes } from '../util/routes';

/**
 * Fetches the list of classes for a given user.
 *
 * @param userId - The ID of the user whose classes are to be fetched.
 * @returns The query object containing the class data.
 */
export function useClass(userId: string) {
  return useQuery({
    queryKey: ['class', userId],
    queryFn: async () => {
      const response = await apiClient.get(ApiRoutes.class.list, {
        params: {
          userId,
        },
      });
      return response.data;
    },
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
    refetchOnWindowFocus: false,
  });
}
