import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { PaginatedData } from '../util/types/general.types';
import { LearningPathDetail, LearningPathShort } from '../util/types/learningPath.types';

/**
 * Fetches a list of learningPaths based on keywords and ages.
 *
 * @param keywords - The keywords to filter the learningPaths.
 * @param ages - The ages to filter the learningPaths.
 * @returns The list of learningPaths.
 */
export async function fetchLearningPaths(keywords?: string[], ages?: number[]) {
  const response = await apiClient.get(ApiRoutes.learningPath.list, {
    params: {
      keywords,
      ages,
    },
  });

  const result: PaginatedData<LearningPathShort> = response.data;

  return result;
}

/**
 * Fetches a LearningPath by its ID.
 *
 * @param id - The ID of the learningPath to be fetched.
 * @returns The learningPath details.
 */
export async function fetchLearningPathById(id: string) {
  const response = await apiClient.get(ApiRoutes.learningPath.get(id));

  const result: LearningPathDetail = response.data;

  return result;
}
