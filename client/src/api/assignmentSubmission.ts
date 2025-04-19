import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import {
  AssignmentSubmissionCreate,
  AssignmentSubmissionDetail,
  AssignmentSubmissionShort,
  AssignmentSubmissionUpdate,
} from '../util/interfaces/assignmentSubmission.interfaces';

/**
 * Fetch a list of assignmentSubmissions
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param groupId - The group of which the assignmentSubmissions need to be fetched
 * @param favoriteId - The favorite of which the assignmentSubmissions need to be fetched
 * @param nodeId - The learningPathNode of which the assignmentSubmissions need to be fetched
 * @returns A list of assignmentSubmissions
 */
export async function fetchAssignmentSubmissions(
  groupId?: string,
  favoriteId?: string,
  nodeId?: string,
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.assignmentSubmission.list, {
    params: {
      page,
      pageSize,
      groupId,
      favoriteId,
      nodeId,
    },
  });

  const result: PaginatedData<AssignmentSubmissionShort> = response.data;

  return result;
}

/**
 * Create an assignmentSubmission
 *
 * @param data - The data of the assignmentSubmission to be created
 * @returns The assignmentSubmissiondetails
 */
export async function createAssignmentSubmission(data: AssignmentSubmissionCreate) {
  const response = await apiClient.put(ApiRoutes.assignmentSubmission.create, {
    data,
  });

  return response.data;
}

/**
 * Fetch an assignmentSubmission by ID
 *
 * @param assignmentSubmissionId - The id of the assignmentSubmission to be fetched
 * @returns The details of the assignmentSubmission
 */
export async function fetchAssignmentSubmissionById(assignmentSubmissionId: string) {
  const response = await apiClient.get(ApiRoutes.assignmentSubmission.get(assignmentSubmissionId));

  const result: AssignmentSubmissionDetail = response.data;
  return result;
}

/**
 * Update an assignmentSubmission
 *
 * @param id - The id of the assignmentSubmission to be updated
 * @param data - The update-data
 * @returns The AssignmentSubmissionDetails
 */
export async function updateAssignmentSubmission(id: string, data: AssignmentSubmissionUpdate) {
  const response = await apiClient.patch(ApiRoutes.assignmentSubmission.update(id), {
    data,
  });

  return response.data;
}
