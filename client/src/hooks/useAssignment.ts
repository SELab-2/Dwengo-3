import { useMutation, useQuery } from '@tanstack/react-query';
import { createAssignment, fetchAssignmentById, fetchAssignments } from '../api/assignment';
import { AssignmentCreate } from '../util/interfaces/assignment.interfaces';
/**
 * Fetches a list of assignments based on the provided class, group, student, and teacher IDs.
 *
 * @param classId - The ID of the class whose assignments are to be fetched.
 * @param groupId - The ID of the group whose assignments are to be fetched.
 * @param studentId - The ID of the student whose assignments are to be fetched.
 * @param teacherId - The ID of the teacher whose assignments are to be fetched.
 * @returns The query object containing the assignment data.
 */
export function useAssignments(
  classId?: string,
  groupId?: string,
  studentId?: string,
  teacherId?: string,
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: ['assignments', classId, groupId, studentId, teacherId],
    queryFn: async () => {
      return await fetchAssignments({ classId, groupId, studentId, teacherId, page, pageSize });
    },
    enabled: !!classId || !!groupId || !!studentId || !!teacherId,
  });
}

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
 * Fetches an assignment by its ID.
 *
 * @param assignmentId - The ID of the assignment to be fetched.
 * @returns The query object containing the assignment data.
 */
export function useAssignmentById(assignmentId: string) {
  return useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: async () => {
      return await fetchAssignmentById(assignmentId);
    },
    enabled: !!assignmentId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Creates a new assignment with the provided assignment name.
 *
 * @returns The mutation object containing the assignment data.
 */
export function useCreateAssignment() {
  return useMutation({
    mutationFn: async (data: AssignmentCreate) => {
      return await createAssignment(data);
    },
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
