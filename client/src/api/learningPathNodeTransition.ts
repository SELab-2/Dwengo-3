import { LearningPathNodeTransitionCreate } from '../util/interfaces/LearningPathNodeTransition.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Create a new LearningPathNodeTransition
 *
 * @param data - The data of the LearningPathNodeTransition to be created
 * @returns The LearningPathNodeTransitiondetails or false
 */
export async function createLearningPathNodeTransition(data: LearningPathNodeTransitionCreate) {
  const response = await apiClient.put(ApiRoutes.learningPathNodeTransition.create, {
    data,
  });

  if (response.status == 200) {
    return response.data;
  }
  return false;
}
