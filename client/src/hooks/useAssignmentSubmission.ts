import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AssignmentSubmissionCreate,
  AssignmentSubmissionUpdate,
} from '../util/interfaces/assignmentSubmission.interfaces';
import {
  createAssignmentSubmission,
  fetchAssignmentSubmissionById,
  fetchAssignmentSubmissions,
  updateAssignmentSubmission,
} from '../api/assignmentSubmission';
import { AxiosProgressEvent } from 'axios';

/**
 * Hook to create an assignment submission.
 *
 * @returns The mutation object for creating an assignment submission.
 */
export function useCreateAssignmentSubmission(
  setProgressEvent?: (progressEvent: AxiosProgressEvent) => void,
) {
  return useMutation({
    mutationFn: async (data: AssignmentSubmissionCreate) => {
      return await createAssignmentSubmission(data, setProgressEvent);
    },
  });
}

/**
 * Hook to fetch an assignment submission by its ID.
 *
 * @param id - The ID of the assignment submission to be fetched.
 * @returns The query object containing the assignment submission data.
 */
export function useAssignmentSubmissionById(id: string) {
  return useQuery({
    queryKey: ['assignmentSubmission', id],
    queryFn: async () => {
      return await fetchAssignmentSubmissionById(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch assignment submissions based on groupId, favoriteId, or nodeId.
 *
 * @param groupId - The ID of the group.
 * @param favoriteId - The ID of the favorite.
 * @param nodeId - The ID of the node.
 * @returns The query object containing the assignment submissions data.
 */
export function useAssignmentSubmissions(groupId?: string, favoriteId?: string, nodeId?: string) {
  return useQuery({
    queryKey: ['assignmentSubmissions', groupId, favoriteId, nodeId],
    queryFn: async () => {
      return await fetchAssignmentSubmissions(groupId, favoriteId, nodeId);
    },
    enabled: !!groupId || !!favoriteId || !!nodeId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to update an assignment submission.
 *
 * @returns The mutation object for updating an assignment submission.
 */
export function useUpdateAssignmentSubmission(
  setProgressEvent?: (progressEvent: AxiosProgressEvent) => void,
) {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AssignmentSubmissionUpdate }) => {
      return await updateAssignmentSubmission(id, data, setProgressEvent);
    },
  });
}
