import { useQuery } from '@tanstack/react-query';
import { fetchLearningObjectById } from '../api/learningObject';

/**
 * Fetches a learningObject by its ID.
 *
 * @param id - The ID of the learningObject to be fetched.
 * @returns The query object containing the learningObject data.
 */
export function useLearningObjectById(id?: string) {
  return useQuery({
    queryKey: ['learningObject', id],
    queryFn: async () => {
      return await fetchLearningObjectById(id!);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
