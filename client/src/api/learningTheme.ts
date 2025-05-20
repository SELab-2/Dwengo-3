import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import {
  LearningThemeDetail,
  LearningThemeShort,
} from '../util/interfaces/learningTheme.interfaces';

/**
 * Fetches a list of learningThemes based on page, and pageSize.
 *
 * @param page - The page number for pagination.
 * @param pageSize - The number of items per page for pagination.
 * @returns The list of learningThemes.
 */
export async function fetchLearningThemes(page: number = 1, pageSize: number = 100) {
  const response = await apiClient.get(ApiRoutes.learningTheme.list, {
    params: {
      page,
      pageSize,
    },
  });

  const result: PaginatedData<LearningThemeShort> = response.data;

  return result;
}

/**
 * Fetches a LearningTheme by its ID.
 *
 * @param id - The ID of the learningTheme to be fetched.
 * @returns The learningTheme details.
 */
export async function fetchLearningThemeById(id: string) {
  const response = await apiClient.get(ApiRoutes.learningTheme.get(id));

  const result: LearningThemeDetail = response.data;

  return result;
}
