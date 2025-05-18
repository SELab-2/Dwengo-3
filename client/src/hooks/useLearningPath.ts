import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchLearningPaths, fetchLearningPathById } from '../api/learningPath';
import { PaginatedData } from '../util/interfaces/general.interfaces';

/**
 * Fetches a list of learningPaths based on keywords, ages, page, and pageSize.
 *
 * @param keywords - The keywords to filter the learningPaths.
 * @param ages - The ages to filter the learningPaths.
 * @param page - The page number for pagination.
 * @param pageSize - The number of items per page for pagination.
 * @returns The query object containing the learningPath data.
 */
export function useLearningPath(keywords?: string[], ages?: number[], pageSize: number = 10) {
  return useInfiniteQuery({
    queryKey: ['learningPath', keywords, ages, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchLearningPaths(keywords, ages, pageParam, pageSize);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    enabled: !!keywords,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a learningPath by its ID.
 *
 * @param id - The ID of the learningPath to be fetched.
 * @returns The query object containing the learningPath data.
 */
export function useLearningPathById(id?: string) {
  return useQuery({
    queryKey: ['learningPath', id],
    queryFn: async () => {
      return await fetchLearningPathById(id!);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
