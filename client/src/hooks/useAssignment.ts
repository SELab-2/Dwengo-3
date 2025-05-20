import { useMutation, useQuery } from '@tanstack/react-query';
import { createAssignment, fetchAssignmentById, fetchAssignments } from '../api/assignment';
import { AssignmentCreate, AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import {
  AssignmentFilterType,
  filterAssignmentOnProgress,
} from '../util/helpers/assignment.helper';

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
 * Hook to fetch the upcoming deadlines for a specific student
 *
 * @param studentId - The ID of the student for whom to fetch upcoming deadlines
 * @return A query object containing the assignments data
 */
export function useUpcomingAssignments({ studentId }: { studentId?: string }) {
  return useQuery({
    queryKey: ['upcomingDeadlines', studentId],
    queryFn: async () => {
      const paginatedAssignments = await fetchAssignments({ studentId });
      const { data: assignments } = paginatedAssignments;

      // Filter out assignments with a deadline in the past
      let filteredAssignments = assignments.filter((assignment) => {
        const deadline = new Date(assignment.deadline);
        return deadline > new Date();
      });

      // Only include assignments that are not finished
      filteredAssignments = filteredAssignments.filter((assignment) =>
        filterAssignmentOnProgress({
          assignment,
          studentId,
          filterType: AssignmentFilterType.NOT_FINISHED,
        }),
      );

      sortDeadlines(filteredAssignments);

      return filteredAssignments;
    },
    enabled: !!studentId,
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
      filteredAssignments = filteredAssignments.filter((assignment) =>
        filterAssignmentOnProgress({
          assignment,
          studentId,
          filterType: AssignmentFilterType.NOT_STARTED,
        }),
      );

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

export function useLatestsFinishedAssignments({ teacherId }: { teacherId?: string }) {
  return useQuery({
    queryKey: ['latestFinishedAssignments', teacherId],
    queryFn: async () => {
      const paginatedAssignments = await fetchAssignments({ teacherId });
      const { data: assignments } = paginatedAssignments;

      // Filter out assignments with a deadline in the future
      const filteredAssignments = assignments.filter((assignment) => {
        const deadline = new Date(assignment.deadline);
        return deadline < new Date();
      });

      // Sort the assignments by the group that finished it
      sortDeadlines(filteredAssignments);

      // Create a array of tuples with the assignment and the corresponding group that finished it
      const finishedAssignments = filteredAssignments.flatMap((assignment) =>
        assignment.groups
          .filter((group) =>
            filterAssignmentOnProgress({
              assignment,
              group,
              filterType: AssignmentFilterType.FINISHED,
            }),
          )
          .map((group) => ({
            assignment,
            group,
          })),
      );

      return finishedAssignments;
    },
    enabled: !!teacherId,
  });
}
