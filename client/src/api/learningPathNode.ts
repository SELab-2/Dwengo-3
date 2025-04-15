import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { LearningPathNodeDetail } from '../util/types/learningPathNode.types';

/**
 * Fetches a LearningPathNode by its ID.
 *
 * @param id - The ID of the learningPathNode to be fetched.
 * @returns The learningPathNode details.
 */
export async function fetchLearningPathNodeById(id: string) {
  const response = await apiClient.get(ApiRoutes.learningPathNode.get(id));
  const result: LearningPathNodeDetail = response.data;

  return result;
}
