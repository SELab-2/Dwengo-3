import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../api';
import { ApiRoutes } from '../util/routes';
import { ClassDetail, ClassShort } from '../util/types/class.types';
import { PaginatedData } from '../util/types/general.types';

/**
 * Fetches a list of classes based on the provided student and teacher IDs.
 *
 * @param studentId - The ID of the student whose classes are to be fetched.
 * @param teacherId - The ID of the teacher whose classes are to be fetched.
 * @returns The query object containing the class data.
 */
export function useClasses(studentId?: string, teacherId?: string) {
  return useQuery({
    queryKey: ['class', studentId, teacherId],
    queryFn: async () => {
      const response = await apiClient.get(ApiRoutes.class.list, {
        params: {
          studentId,
          teacherId,
        },
      });

      const result: PaginatedData<ClassShort> = response.data;

      return result;
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

      const result: ClassDetail = response.data;

      return result;
    },
    enabled: !!classId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches multiple classes by their IDs.
 *
 * @param classIds - The IDs of the classes to be fetched.
 * @returns The query object containing the classes data.
 */
export function useClassesByIds(classIds: string[]) {
  return useQuery({
    queryKey: ['classes', classIds],
    queryFn: async () => {
      let result: Array<ClassDetail> = [];

      await Promise.all(
        classIds.map(async (classId) => {
          const response = await apiClient.get(ApiRoutes.class.get(classId));

          const classDetails: ClassDetail = response.data;

          result.push(classDetails);
        }),
      );

      return result;
    },
    enabled: !!classIds.length,
    refetchOnWindowFocus: false,
  });
}

/**
 * Creates a new class with the provided class name.
 *
 * @returns The mutation object for creating the class.
 */
export function useCreateClass() {
  return useMutation({
    mutationFn: async (className: string) => {
      const response = await apiClient.put(ApiRoutes.class.create, {
        name: className,
      });

      const result: ClassDetail = response.data;

      return result;
    },
  });
}
