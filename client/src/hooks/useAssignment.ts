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

/**
 * Hook to fetch assignments for a specific group
 *
 * @param studentId - The ID of the student for whom to fetch assignments
 * @param classId - The ID of the class for which to fetch assignments
 * @param groupId - The ID of the group for which to fetch assignments
 * @param teacherId - The ID of the teacher for whom to fetch assignments
 * @param page - The page number of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @returns A query object containing the assignments data
 */
export function useAssignments({
  studentId,
  classId,
  groupId,
  teacherId,
  page,
  pageSize,
}: {
  studentId?: string;
  classId?: string;
  groupId?: string;
  teacherId?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['assignments', studentId, classId, groupId, teacherId, page, pageSize],
    queryFn: async () => {
      return await fetchAssignments({ studentId, classId, groupId, teacherId, page, pageSize });
    },
    enabled: !!studentId || !!classId || !!groupId || !!teacherId,
    refetchOnWindowFocus: false,
  });
}
