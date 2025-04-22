import { useMutation, useQuery } from "@tanstack/react-query";
import { createAssignment, fetchAssignmentById, fetchAssignments } from "../api/assignment";
import { AssignmentCreate } from "../util/interfaces/assignment.interfaces";

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
    pageSize: number = 10
) {
  return useQuery({
    queryKey: ['assignments', classId, groupId, studentId, teacherId],
    queryFn: async () => {
      return await fetchAssignments(classId, groupId, studentId, teacherId, page, pageSize);
    },
    enabled: !!classId || !!groupId || !!studentId || !!teacherId,
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
        }
    });
    }