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
export function useLearningPath(
  keywords?: string[],
  ages?: number[],
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: ['learningPath', keywords, ages, page, pageSize],
    queryFn: async () => {
      return await fetchLearningPaths(keywords, ages, page, pageSize);
    },
    enabled: !!keywords,
    refetchOnWindowFocus: false,
  });
}

export function useLearningPathInfinity(
  searchTitle?: string,
  searchKeyword?: string,
  pageSize: number = 10,
) {
  return useInfiniteQuery({
    queryKey: ['learningPath', searchTitle, searchKeyword, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchLearningPaths(
        undefined,
        undefined,
        pageParam,
        pageSize,
        searchTitle,
        searchKeyword,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
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
