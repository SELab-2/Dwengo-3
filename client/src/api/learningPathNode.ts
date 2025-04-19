import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import {
  LearningPathNodeCreate,
  LearningPathNodeDetail,
} from '../util/interfaces/learningPathNode.interfaces';

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

/**
 * Create a new LearningPathNode
 *
 * @param data - The data of the LearningPathNode to be created
 * @returns The LearningPathNodedetails
 */
export async function createLearningPathNode(data: LearningPathNodeCreate) {
  const response = await apiClient.put(ApiRoutes.learningPathNode.create, {
    data,
  });

  return response.data;
}
