import { AssignmentDetail, AssignmentShort } from '../util/types/assignment.types';
import { PaginatedData } from '../util/types/general.types';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Fetches a list of assignments based on the provided class, group, student, and teacher IDs.
 *
 * @param classId - The ID of the class whose assignments are to be fetched.
 * @param groupId - The ID of the group whose assignments are to be fetched.
 * @param studentId - The ID of the student whose assignments are to be fetched.
 * @param teacherId - The ID of the teacher whose assignments are to be fetched.
 * @returns Paginated data containing the list of assignments.
 */
export async function fetchAssignments(
  classId?: string,
  groupId?: string,
  studentId?: string,
  teacherId?: string,
) {
  const response = await apiClient.get(ApiRoutes.assignment.list, {
    params: {
      classId,
      groupId,
      studentId,
      teacherId,
    },
  });

  const result: PaginatedData<AssignmentShort> = response.data;

  return result;
}

/**
 * Fetches an assignment by its ID.
 *
 * @param id - The ID of the assignment to be fetched.
 * @returns The assignment details.
 */
export async function fetchAssignmentById(id: string) {
  const response = await apiClient.get(ApiRoutes.assignment.get(id));

  const result: AssignmentDetail = response.data;

  return result;
}
