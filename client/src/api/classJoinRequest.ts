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
  const response = await apiClient.put(ApiRoutes.classJoinRequest.student.create, {
    data,
  });

  if (response.status == 200) {
    return true;
  }
  return false;
}

/**
 * Create a classJoinRequest as a teacher
 *
 * @param data - The data with the classId on which to put the request
 * @returns Succesfully created or not
 */
export async function createClassJoinRequestTeacher(data: ClassJoinRequestCreate) {
  const response = await apiClient.put(ApiRoutes.classJoinRequest.teacher.create, {
    data,
  });

  if (response.status == 200) {
    return true;
  }
  return false;
}

/**
 * Fetch a list of student classJoinRequests
 *
 * @param classId - The class of which to fetch the requests
 * @param userId - The user of which to fetch the requests
 * @returns A list of classJoinRequest
 */
export async function getClassJoinRequestsStudent(classId?: string, userId?: string) {
  const response = await apiClient.get(ApiRoutes.classJoinRequest.student.list, {
    params: {
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
 * @param classId - The class of which to fetch the requests
 * @param userId - The user of which to fetch the requests
 * @returns A list of classJoinRequest
 */
export async function getClassJoinRequestsTeacher(classId?: string, userId?: string) {
  const response = await apiClient.get(ApiRoutes.classJoinRequest.teacher.list, {
    params: {
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
  const response = await apiClient.get(ApiRoutes.classJoinRequest.student.reply, {
    data,
  });

  if (response.status == 200) {
    return true;
  }
  return false;
}

/**
 * Accept or deny a teacher classJoinRequest
 *
 * @param data - The handle-data with the id and accept/deny
 * @returns Succesfully handled or not
 */
export async function handleClassJoinRequestTeacher(data: ClassJoinRequestPost) {
  const response = await apiClient.get(ApiRoutes.classJoinRequest.teacher.reply, {
    data,
  });

  if (response.status == 200) {
    return true;
  }
  return false;
}
