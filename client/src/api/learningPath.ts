import apiClient from './apiClient';
import { ApiRoutes } from './api.routes';
import {
  LearningPathCreate,
  LearningPathDetail,
  LearningPathShort,
} from '../util/interfaces/learningPath.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';

/**
 * Fetches a list of learning paths based on the provided keywords and age range.
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param keywords - The keywords to filter the learning paths.
 * @param age - The age range to filter the learning paths.
 * @returns Paginated data containing the list of learning paths.
 */
export async function fetchLearningPaths(
  keywords?: string[],
  age?: number[],
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.learningPath.list, {
    params: {
      page,
      pageSize,
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

/**
 * Creates a new learningPath
 *
 * @param data - The date of the learningPath to be created
 * @returns The learningPath details
 */
export async function createLearningPath(data: LearningPathCreate) {
  const response = await apiClient.put(ApiRoutes.learningPath.create, {
    data,
  });

  return response.data;
}
