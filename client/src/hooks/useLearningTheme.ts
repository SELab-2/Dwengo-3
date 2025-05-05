import { useQuery } from '@tanstack/react-query';
import { fetchLearningThemeById, fetchLearningThemes } from '../api/learningTheme';

/**
 * Fetches a list of learningThemes based on page, and pageSize.
 *
 * @param page - The page number for pagination.
 * @param pageSize - The number of items per page for pagination.
 * @returns The query object containing the learningTheme data.
 */
export function useLearningTheme(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['learningTheme', page, pageSize],
    queryFn: async () => {
      return await fetchLearningThemes(page, pageSize);
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a learningTheme by its ID.
 *
 * @param id - The ID of the learningTheme to be fetched.
 * @returns The query object containing the learningTheme data.
 */
export function useLearningThemeById(id?: string) {
  return useQuery({
    queryKey: ['learningTheme', id],
    queryFn: async () => {
      return await fetchLearningThemeById(id!);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
