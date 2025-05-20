import { ApiRoutes } from '../api/api.routes';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { StudentDetail, StudentShort } from '../util/interfaces/student.interfaces';
import apiClient from './apiClient';

/**
 * Fetches a list of students based on the provided user, class, and group IDs.
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param userId - The ID of the user whose student are to be fetched.
 * @param classId - The ID of the class whose students are to be fetched.
 * @param groupId - The ID of the group whose students are to be fetched.
 * @returns The list of students.
 */
export async function fetchStudents(
  userId?: string,
  classId?: string,
  groupId?: string,
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.student.list, {
    params: {
      page,
      pageSize,
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
