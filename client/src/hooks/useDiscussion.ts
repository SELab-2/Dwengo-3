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
  userId: string | undefined;
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
    enabled: !!userId,
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
    mutationFn: async ({ groupId }: { groupId: string }) => {
      return await createDiscussion({ groupId });
    },
  });
}

export function useDetailedDiscussionsByIds(ids: string[]) {
  return useQuery({
    queryKey: ['discussions', ids],
    queryFn: async () => {
      const discussions = await Promise.all(ids.map((id) => fetchDiscussionById(id)));
      return discussions;
    },
    enabled: !!ids.length,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches the newest discussions for a specific user.
 *
 * @param userId - The ID of the user for whom to fetch discussions
 * @returns Paginated data containing the list of discussions.
 */
export function useLatestDiscussions({ userId }: { userId: string | undefined }) {
  return useQuery({
    queryKey: ['newestDiscussions', userId],
    queryFn: async () => {
      const paginatedDiscussions: PaginatedData<DiscussionShort> = await fetchDiscussions(
        userId,
        undefined,
      );
      const discussions = paginatedDiscussions.data;

      // Map the discussionShorts to discussionDetails
      const discussionDetails = await Promise.all(
        discussions.map((discussion) => fetchDiscussionById(discussion.id)),
      );

      // Sort the discussions be the newest messages
      const sortedDiscussions = discussionDetails.sort((a, b) => {
        const aLastMessageDate = a.messages[0]?.createdAt;
        const bLastMessageDate = b.messages[0]?.createdAt;
        return bLastMessageDate < aLastMessageDate ? -1 : 1;
      });

      return sortedDiscussions;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}
