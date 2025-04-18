import { useQuery } from '@tanstack/react-query';
import { fetchLearningPaths, fetchLearningPathById } from '../api/learningPath';

/**
 * Fetches a list of learningPaths based on keywords, ages, page, and pageSize.
 *
 * @param keywords - The keywords to filter the learningPaths.
 * @param ages - The ages to filter the learningPaths.
 * @param page - The page number for pagination.
 * @param pageSize - The number of items per page for pagination.
 * @returns The query object containing the class data.
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
    enabled: !!keywords, // Make sure it's enabled when keywords are available
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
