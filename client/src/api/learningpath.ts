import apiClient from './apiClient';
import { ApiRoutes } from './api.routes';
import { LearningPathDetail, LearningPathShort } from '../util/types/learningPath.types';
import { PaginatedData } from '../util/types/general.types';

/**
 * Fetches a list of learning paths based on the provided keywords and age range.
 *
 * @param keywords - The keywords to filter the learning paths.
 * @param age - The age range to filter the learning paths.
 * @returns Paginated data containing the list of learning paths.
 */
export async function fetchLearningPaths(keywords?: string[], age?: number[]) {
  const response = await apiClient.get(ApiRoutes.learningPath.list, {
    params: {
      keywords,
      age,
    },
  });

  const result: PaginatedData<LearningPathShort> = response.data;

  return result;
}

/**
 * Fetches a learning path by its ID.
 *
 * @param id - The ID of the learning path to be fetched.
 * @returns The learning path details.
 */
export async function fetchLearningPathById(id: string) {
  const response = await apiClient.get(ApiRoutes.learningPath.get(id));

  const result: LearningPathDetail = response.data;

  return result;
}
