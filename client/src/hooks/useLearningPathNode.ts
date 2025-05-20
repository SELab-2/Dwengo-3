import { useQuery } from '@tanstack/react-query';
import { fetchLearningPathNodeById } from '../api/learningPathNode';

/**
 * Fetches a learningPathNode by its ID.
 *
 * @param id - The ID of the learningPathNode to be fetched.
 * @returns The query object containing the learningPathNode data.
 */
export function useLearningPathNodeById(id?: string) {
  return useQuery({
    queryKey: ['learningPathNode', id],
    queryFn: async () => {
      return await fetchLearningPathNodeById(id!);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
