import { useQuery } from '@tanstack/react-query';
import { fetchLearningObjectById } from '../api/learningObject';
import { fetchLearningPathById } from '../api/learningPath';

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

export function useLearningObjects(learningPathId: string) {
  return useQuery({
    queryKey: ['learningObjects', learningPathId],
    queryFn: async () => {
      const learningPath = await fetchLearningPathById(learningPathId);
      const objects = learningPath.learningPathNodes.map((node) =>
        fetchLearningObjectById(node.learningObject.id),
      );
      return await Promise.all(objects);
    },
    enabled: !!learningPathId,
    refetchOnWindowFocus: false,
  });
}
