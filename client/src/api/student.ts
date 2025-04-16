import { ApiRoutes } from '../api/api.routes';
import { PaginatedData } from '../util/types/general.types';
import { StudentDetail, StudentShort } from '../util/types/user.types';
import apiClient from './apiClient';

/**
 * Fetches a list of students based on the provided user, class, and group IDs.
 *
 * @param userId - The ID of the user whose student are to be fetched.
 * @param classId - The ID of the class whose students are to be fetched.
 * @param groupId - The ID of the group whose students are to be fetched.
 * @returns The list of students.
 */
export async function fetchStudents(userId?: string, classId?: string, groupId?: string) {
  const response = await apiClient.get(ApiRoutes.student.list, {
    params: {
      userId,
      classId,
      groupId,
    },
  });

  const result: PaginatedData<StudentShort> = response.data;

  return result;
}

/**
 * Fetches a student by their ID.
 *
 * @param id - The ID of the student to be fetched.
 * @returns The student details.
 */
export async function fetchStudentById(id: string) {
  const response = await apiClient.get(ApiRoutes.student.get(id));

  const result: StudentDetail = response.data;

  return result;
}
