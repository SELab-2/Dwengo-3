import { useQuery } from '@tanstack/react-query';
import { fetchClassById, fetchClasses } from '../api/class';

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
      return await fetchClasses(studentId, teacherId);
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
      return await fetchClassById(classId);
    },
    enabled: !!classId,
    refetchOnWindowFocus: false,
  });
}
