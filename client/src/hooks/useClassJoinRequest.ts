import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getClassJoinRequestsStudent,
  handleClassJoinRequestStudent,
} from '../api/classJoinRequest.ts';
import { Decision } from '../util/interfaces/classJoinRequest.interfaces.ts';

/**
 * Hook to fetch class join requests for a specific class
 *
 * @param classId - The ID of the class for which to fetch join requests
 * @return A query object containing the class join requests data
 */
export function useClassJoinRequests(classId: string) {
  return useQuery({
    queryKey: ['classJoinRequests', classId],
    queryFn: async () => {
      return await getClassJoinRequestsStudent(classId);
    },
    enabled: !!classId,
    refetchOnWindowFocus: false,
  });
}

export function useHandleClassJoinRequestStudent() {
  return useMutation({
    mutationFn: async ({ requestId, decision }: { requestId: string; decision: Decision }) => {
      return await handleClassJoinRequestStudent({ requestId, decision });
    },
  });
}
