import apiClient from './apiClient';
import { ApiRoutes } from './api.routes';
import {
  ClassJoinRequestCreate,
  ClassJoinRequestDetail,
  ClassJoinRequestPost,
} from '../util/interfaces/classJoinRequest.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';

/**
 * Create a classJoinRequest as a student
 *
 * @param data - The data with the classId on which to put the request
 * @returns Succesfully created or not
 */
export async function createClassJoinRequestStudent(data: ClassJoinRequestCreate) {
  const response = await apiClient.put(ApiRoutes.classJoinRequest.student.create, data);

  return response.data;
}

/**
 * Create a classJoinRequest as a teacher
 *
 * @param data - The data with the classId on which to put the request
 * @returns Succesfully created or not
 */
export async function createClassJoinRequestTeacher(data: ClassJoinRequestCreate) {
  const response = await apiClient.put(ApiRoutes.classJoinRequest.teacher.create, data);

  return response.data;
}

/**
 * Fetch a list of student classJoinRequests
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param classId - The class of which to fetch the requests
 * @param userId - The user of which to fetch the requests
 * @returns A list of classJoinRequest
 */
export async function getClassJoinRequestsStudent(
  classId?: string,
  userId?: string,
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.classJoinRequest.student.list, {
    params: {
      page,
      pageSize,
      classId,
      userId,
    },
  });

  const result: PaginatedData<ClassJoinRequestDetail> = response.data;

  return result;
}

/**
 * Fetch a list of teacher classJoinRequests
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param classId - The class of which to fetch the requests
 * @param userId - The user of which to fetch the requests
 * @returns A list of classJoinRequest
 */
export async function getClassJoinRequestsTeacher(
  classId?: string,
  userId?: string,
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.classJoinRequest.teacher.list, {
    params: {
      page,
      pageSize,
      classId,
      userId,
    },
  });

  const result: PaginatedData<ClassJoinRequestDetail> = response.data;

  return result;
}

/**
 * Accept or deny a student classJoinRequest
 *
 * @param data - The handle-data with the id and accept/deny
 * @returns Succesfully handled or not
 */
export async function handleClassJoinRequestStudent(data: ClassJoinRequestPost) {
  const response = await apiClient.post(ApiRoutes.classJoinRequest.student.reply, data);

  return response.data;
}

/**
 * Accept or deny a teacher classJoinRequest
 *
 * @param data - The handle-data with the id and accept/deny
 * @returns Succesfully handled or not
 */
export async function handleClassJoinRequestTeacher(data: ClassJoinRequestPost) {
  const response = await apiClient.post(ApiRoutes.classJoinRequest.teacher.reply, data);

  return response.data;
}
