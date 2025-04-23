import { useQuery } from '@tanstack/react-query';
import { fetchAssignments } from '../api/assignment.ts';

/**
 * Hook to fetch assignments for a specific student
 *
 * @param studentId - The ID of the student for whom to fetch assignments
 * @return A query object containing the assignments data
 */
export function useAssignmentsOfStudent(studentId: string) {
  return useQuery({
    queryKey: ['assignmentsOfStudent', studentId],
    queryFn: async () => {
      return await fetchAssignments({ studentId });
    },
    enabled: !!studentId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch assignments for a specific class
 *
 * @param classId - The ID of the class for which to fetch assignments
 * @return A query object containing the assignments data
 */
export function useAssignmentsOfClass(classId: string) {
  return useQuery({
    queryKey: ['assignmentsOfClass', classId],
    queryFn: async () => {
      return await fetchAssignments({ classId });
    },
    enabled: !!classId,
    refetchOnWindowFocus: false,
  });
}
