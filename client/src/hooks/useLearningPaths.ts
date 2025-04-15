import { useQuery } from '@tanstack/react-query';
import { fetchLearningPaths, fetchLearningPathById } from '../api/learningPath';

/**
 * Fetches a list of learningPaths based on keywords and ages.
 *
 * @param keywords - The keywords to filter the classes.
 * @param ages - The ages to filter the classes.
 * @returns The query object containing the class data.
 */
export function useLearningPath(keywords?: string[], ages?: number[]) {
  return useQuery({
    queryKey: ['learningPath', keywords, ages],
    queryFn: async () => {
      return await fetchLearningPaths(keywords, ages);
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
export function useLearningPathById(id: string) {
  return useQuery({
    queryKey: ['learningPath', id],
    queryFn: async () => {
      return await fetchLearningPathById(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
