import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import qs from 'qs';
import {
  LearningPathShort,
  LearningPathDetail,
  LearningPathCreate,
} from '../util/interfaces/learningPath.interfaces';
import { Repeat } from '@mui/icons-material';

/**
 * Fetches a list of learningPaths based on keywords, ages, page, and pageSize.
 *
 * @param keywords - The keywords to filter the learningPaths.
 * @param ages - The ages to filter the learningPaths.
 * @param page - The page number for pagination.
 * @param pageSize - The number of items per page for pagination.
 * @returns The list of learningPaths.
 */
export async function fetchLearningPaths(
  keywords?: string[],
  ages?: number[],
  page: number = 1,
  pageSize: number = 10,
) {
  const response = await apiClient.get(ApiRoutes.learningPath.list, {
    params: {
      keywords,
      ages,
      page,
      pageSize,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
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
