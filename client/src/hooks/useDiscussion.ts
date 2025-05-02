import { useMutation, useQuery } from '@tanstack/react-query';
import { createDiscussion, fetchDiscussionById, fetchDiscussions } from '../api/discussion';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { DiscussionShort } from '../util/interfaces/discussion.interfaces';

/**
 * Fetches a list of discussions based on the provided user ID.
 *
 * @param userId - The ID of the user whose discussions need to be fetched
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @returns Paginated data containing the list of discussions.
 */
export function useDiscussions({
  userId,
  assignmentId,
  page,
  pageSize,
}: {
  userId?: string;
  assignmentId?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['discussions', assignmentId, userId, page, pageSize],
    queryFn: async () => {
      const result: PaginatedData<DiscussionShort> = await fetchDiscussions(
        userId,
        assignmentId,
        page,
        pageSize,
      );
      return result;
    },
    enabled: !!userId || !!assignmentId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a discussion by its ID.
 *
 * @param id - The ID of the discussion to be fetched.
 * @returns The discussion details.
 */
export function useDiscussionById(id: string) {
  return useQuery({
    queryKey: ['discussion', id],
    queryFn: async () => {
      const discussion = await fetchDiscussionById(id);
      return discussion;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useCreateDiscussion() {
  return useMutation({
    mutationFn: async ({ groupId, message }: { groupId: string; message: string }) => {
      //TODO: update the created discussion with the message as soon as the endpoint is available
      return await createDiscussion({ groupId });
    },
  });
}
