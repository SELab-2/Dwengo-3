import {
  DiscussionCreate,
  DiscussionDetail,
  DiscussionShort,
} from '../util/interfaces/discussion.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Fetches a list of discussions based on the provided filters.
 *
 * @param userId - The ID of the user whose discussions need to be fetched
 * @param assignmentId - The ID of the assignment whose discussions need to be fetched
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @returns Paginated data containing the list of discussions.
 */
export async function fetchDiscussions(
  userId?: string,
  assignmentId?: string,
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.discussion.list, {
    params: {
      userId,
      assignmentId,
      page,
      pageSize,
    },
  });

  const result: PaginatedData<DiscussionShort> = response.data;

  return result;
}

/**
 * Fetches a discussion by its ID.
 *
 * @param id - The ID of the disussion to be fetched.
 * @returns The discussion details.
 */
export async function fetchDiscussionById(id: string) {
  const response = await apiClient.get(ApiRoutes.discussion.get(id));

  const result: DiscussionDetail = response.data;

  return result;
}

/**
 * Create a discussion
 *
 * @param data - The data of the discussion to be created
 * @returns The discussiondetails
 */
export async function createDiscussion(data: DiscussionCreate) {
  const response = await apiClient.put(ApiRoutes.discussion.create, data);

  return response.data;
}

/**
 * Update a discussion
 *
 * @param id - The ID of the discussion to be updated
 * @param data - The data of the discussion to be updated
 * @returns The discussiondetails
 */
export async function updateDiscussion(id: string, data: DiscussionCreate) {
  const response = await apiClient.put(ApiRoutes.discussion.update(id), {
    data,
  });

  return response.data;
}
