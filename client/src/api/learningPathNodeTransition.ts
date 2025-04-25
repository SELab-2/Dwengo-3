import { LearningPathNodeTransitionCreate } from '../util/interfaces/LearningPathNodeTransition.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Create a new LearningPathNodeTransition
 *
 * @param data - The data of the LearningPathNodeTransition to be created
 * @returns The LearningPathNodeTransitiondetails
 */
export async function createLearningPathNodeTransition(data: LearningPathNodeTransitionCreate) {
  const response = await apiClient.put(ApiRoutes.learningPathNodeTransition.create, data);

  return response.data;
}
