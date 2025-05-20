import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import {
  LearningObjectCreate,
  LearningObjectDetail,
  LearningObjectShort,
  LearningObjectUpdate,
} from '../util/interfaces/learningObject.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';

/**
 * Fetches a LearningObject by its ID.
 *
 * @param id - The ID of the learningObject to be fetched.
 * @param signal signal used to abort request.
 * @returns The learningObject details.
 */
export async function fetchLearningObjectById(id: string, signal?: AbortSignal) {
  const response = await apiClient.get(ApiRoutes.learningObject.get(id), { signal });
  const result: LearningObjectDetail = response.data;

  return result;
}

/**
 * Create a new LearningObject
 *
 * @param data - The data of the learningObject to be created
 * @returns The learningObject details
 */
export async function createLearningObject(data: LearningObjectCreate) {
  const response = await apiClient.put(ApiRoutes.learningObject.create, data);

  return response.data;
}

/**
 * Fetch a list of learningObjects based on the filters
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param keywords - A list of keywords on which to filter
 * @param targetAges - A list of targetAges on which to filter
 * @returns A paginated list of learningObjects
 */
export async function fetchLearningObjects(
  keywords?: string[],
  targetAges?: number[],
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.learningObject.list, {
    params: {
      page,
      pageSize,
      keywords,
      targetAges,
    },
  });

  const result: PaginatedData<LearningObjectShort> = response.data;

  return result;
}

/**
 * Update a learningObject by its ID
 *
 * @param id - The id of the learningObject to update
 * @param data - The update-data
 * @returns The learningObject details
 */
export async function updateLearningObject(id: string, data: LearningObjectUpdate) {
  const response = await apiClient.patch(ApiRoutes.learningObject.update(id), data);

  return response.data;
}

/**
 * Delete a learningObject by its Id
 *
 * @param id - The id of the learningObject to be deleted
 * @returns The learningObject details
 */
export async function deleteLearningObject(id: string) {
  const response = await apiClient.delete(ApiRoutes.learningObject.delete(id));

  return response.data;
}
