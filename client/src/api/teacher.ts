import { ApiRoutes } from '../api/api.routes';
import { TeacherDetail, TeacherShort } from '../util/types/user.types';
import apiClient from './apiClient';

/**
 * Fetches a list of teachers based on the provided user, class, and group IDs.
 *
 * @param userId - The ID of the user whose teacher are to be fetched.
 * @param classId - The ID of the class whose teachers are to be fetched.
 * @param groupId - The ID of the group whose teachers are to be fetched.
 * @returns The list of teachers.
 */
export async function fetchTeachers(userId?: string, classId?: string, groupId?: string) {
  const response = await apiClient.get(ApiRoutes.teacher.list, {
    params: {
      userId,
      classId,
      groupId,
    },
  });

  const result: TeacherShort[] = response.data;

  return result;
}

/**
 * Fetches a teacher by their ID.
 *
 * @param id - The ID of the teacher to be fetched.
 * @returns The teacher details.
 */
export async function fetchTeacherById(id: string) {
  const response = await apiClient.get(ApiRoutes.teacher.get(id));

  const result: TeacherDetail = response.data;

  return result;
}
