import { useMutation, useQuery } from '@tanstack/react-query';
import { createAssignment, fetchAssignmentById, fetchAssignments } from '../api/assignment';
import { AssignmentCreate, AssignmentShort2 } from '../util/interfaces/assignment.interfaces';

/**
 * Fetches a list of assignments based on the provided class, group, student, and teacher IDs.
 *
 * @param classId - The ID of the class whose assignments are to be fetched.
 * @param groupId - The ID of the group whose assignments are to be fetched.
 * @param studentId - The ID of the student whose assignments are to be fetched.
 * @param teacherId - The ID of the teacher whose assignments are to be fetched.
 * @returns The query object containing the assignment data.
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
 * Hook to fetch the upcoming deadlines for a specific student or teacher
 *
 * @param studentId - The ID of the student for whom to fetch upcoming deadlines
 * @param teacherId - The ID of the teacher for whom to fetch upcoming deadlines
 * @return A query object containing the assignments data
 */
export function useUpcomingAssignments({
  studentId,
  teacherId,
}: {
  studentId?: string;
  teacherId?: string;
}) {
  return useQuery({
    queryKey: ['upcomingDeadlines', studentId, teacherId],
    queryFn: async () => {
      const paginatedAssignments = await fetchAssignments({ studentId, teacherId });
      const { data: assignments } = paginatedAssignments;

      // Filter out assignments with a deadline in the past
      const filteredAssignments = assignments.filter((assignment) => {
        const deadline = new Date(assignment.deadline);
        return deadline > new Date();
      });

      sortDeadlines(filteredAssignments);

      return filteredAssignments;
    },
    enabled: !!studentId || !!teacherId,
  });
}

export function useNotStartedAssignments({ studentId }: { studentId?: string }) {
  return useQuery({
    queryKey: ['notStartedAssignments', studentId],
    queryFn: async () => {
      const paginatedAssignments = await fetchAssignments({ studentId });
      const { data: assignments } = paginatedAssignments;

      // Filter out assignments with a deadline in the past
      let filteredAssignments = assignments.filter((assignment) => {
        const deadline = new Date(assignment.deadline);
        return deadline > new Date();
      });

      // Filter out assignments that already have progress
      filteredAssignments = filteredAssignments.filter((assignment) => {
        const group = assignment.groups.find((group) => {
          return group.students.some((student) => student.id == studentId);
        });
        return group?.progress.length === 0;
      });

      sortDeadlines(filteredAssignments);

      return filteredAssignments;
    },
    enabled: !!studentId,
  });
}

/**
 * Sorts an array of assignments by their deadlines in ascending order in-place.
 *
 * @param assignments - The array of assignments to be sorted.
 */
export function sortDeadlines(assignments: AssignmentShort2[]): void {
  assignments.sort((a, b) => {
    const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return deadlineA - deadlineB;
  });
}
