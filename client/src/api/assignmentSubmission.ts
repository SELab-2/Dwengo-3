import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import {
  AssignmentSubmissionCreate,
  AssignmentSubmissionDetail,
  AssignmentSubmissionShort,
  AssignmentSubmissionUpdate,
} from '../util/interfaces/assignmentSubmission.interfaces';
import { AxiosProgressEvent } from 'axios';

/**
 * Fetch a list of assignmentSubmissions
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param groupId - The group of which the assignmentSubmissions need to be fetched
 * @param favoriteId - The favorite of which the assignmentSubmissions need to be fetched
 * @param nodeId - The learningPathNode of which the assignmentSubmissions need to be fetched
 * @param signal - signal to abort request.
 * @returns A list of assignmentSubmissions
 */
export async function fetchAssignmentSubmissions(
  groupId?: string,
  favoriteId?: string,
  nodeId?: string,
  page?: number,
  pageSize?: number,
  signal?: AbortSignal,
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
 * @param setProgressEvent
 * @returns The assignmentSubmissiondetails
 */
export async function createAssignmentSubmission(
  data: AssignmentSubmissionCreate,
  setProgressEvent?: (progressEvent: AxiosProgressEvent) => void,
) {
  if (data.submissionType === 'FILE') {
    const formData = new FormData();

    // Append primitive fields
    if (data.groupId) formData.append('groupId', data.groupId);
    if (data.favoriteId) formData.append('favoriteId', data.favoriteId);
    formData.append('nodeId', data.nodeId);
    formData.append('submissionType', data.submissionType);
    formData.append('file', data.file!);

    const response = await apiClient.put(ApiRoutes.assignmentSubmission.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(event) {
        setProgressEvent && setProgressEvent(event);
      },
    });

    return response.data;
  }
  const response = await apiClient.put(ApiRoutes.assignmentSubmission.create, data);

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
export async function updateAssignmentSubmission(
  id: string,
  data: AssignmentSubmissionUpdate,
  setProgressEvent?: (progressEvent: AxiosProgressEvent) => void,
) {
  if (data.submissionType === 'FILE') {
    const formData = new FormData();

    // Append primitive fields
    formData.append('submissionType', data.submissionType);
    formData.append('file', data.file!);

    const response = await apiClient.patch(ApiRoutes.assignmentSubmission.update(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(event) {
        setProgressEvent && setProgressEvent(event);
      },
    });

    return response.data;
  }
  const response = await apiClient.patch(ApiRoutes.assignmentSubmission.update(id), data);

  return response.data;
}

/**
 * Download a file submission
 *
 * @param id - The id of the assignmentSubmission to be downloaded
 * @param fileName - The name of the file to be downloaded
 */
export async function downloadFileSubmission(id: string, fileName: string) {
  const response = await apiClient.get(ApiRoutes.assignmentSubmission.download(id), {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
