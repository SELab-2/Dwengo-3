import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import {
  LearningObjectCreate,
  LearningObjectDetail,
  LearningObjectShort,
  LearningObjectUpdate,
} from '../util/interfaces/learningObject.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { UUID } from 'crypto';

/**
 * Fetches a LearningObject by its ID.
 *
 * @param id - The ID of the learningObject to be fetched.
 * @returns The learningObject details.
 */
export async function fetchLearningObjectById(id: string) {
  const response = await apiClient.get(ApiRoutes.learningObject.get(id));
  const result: LearningObjectDetail = response.data;

  return result;
}

/**
 * Create a new LearningObject
 *
 * @param data - The data of the learningObject to be created
 * @returns The learningObject details or false
 */
export async function createLearningObject(data: LearningObjectCreate) {
  const response = await apiClient.put(ApiRoutes.learningObject.create, {
    data,
  });

  if (response.status == 200) {
    return response.data;
  }
  return false;
}

/**
 * Fetch a list of learningObjects based on the filters
 *
 * @param keywords - A list of keywords on which to filter
 * @param targetAges - A list of targetAges on which to filter
 * @returns A paginated list of learningObjects
 */
export async function fetchLearningObjects(keywords?: string[], targetAges?: number[]) {
  const response = await apiClient.get(ApiRoutes.learningObject.list, {
    params: {
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
 * @returns The learningObject details or false
 */
export async function updateLearningObject(id: UUID, data: LearningObjectUpdate) {
  const response = await apiClient.patch(ApiRoutes.learningObject.update(id), {
    data,
  });

  if (response.status == 200) {
    return response.data;
  }
  return false;
}

/**
 * Delete a learningObject by its Id
 *
 * @param id - The id of the learningObject to be deleted
 * @returns The learningObject details or false
 */
export async function deleteLearningObject(id: UUID) {
  const response = await apiClient.delete(ApiRoutes.learningObject.delete(id));

  if (response.status == 200) {
    return response.data;
  }
  return false;
}
