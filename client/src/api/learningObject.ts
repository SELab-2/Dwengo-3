import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { LearningObjectDetail } from '../util/interfaces/learningObject.interfaces';

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
