import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { ClassDetail, ClassShort } from '../util/interfaces/class.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';

/**
 * Fetches a list of classes based on the provided student or teacher IDs.
 *
 * @param studentId - The ID of the student whose classes are to be fetched.
 * @param teacherId - The ID of the teacher whose classes are to be fetched.
 * @returns The list of classes.
 */
export async function fetchClasses(studentId?: string, teacherId?: string) {
  const response = await apiClient.get(ApiRoutes.class.list, {
    params: {
      studentId,
      teacherId,
    },
  });

  const result: PaginatedData<ClassShort> = response.data;

  return result;
}

/**
 * Fetches a class by its ID.
 *
 * @param id - The ID of the class to be fetched.
 * @returns The class details.
 */
export async function fetchClassById(id: string) {
  const response = await apiClient.get(ApiRoutes.class.get(id));

  const result: ClassDetail = response.data;

  return result;
}
