import { UUID } from 'crypto';
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
 * @param groupIds - A list of the groupIds of which the discussions need to be fetched
 * @returns Paginated data containing the list of discussions.
 */
export async function fetchDiscussions(groupIds: [UUID]) {
  const response = await apiClient.get(ApiRoutes.discussion.list, {
    params: {
      groupIds,
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
export async function fetchDiscussionById(id: UUID) {
  const response = await apiClient.get(ApiRoutes.discussion.get(id));

  const result: DiscussionDetail = response.data;

  return result;
}

/**
 * Create a discussion
 *
 * @param data - The data of the discussion to be created
 * @returns The discussiondetails or false
 */
export async function createDiscussion(data: DiscussionCreate) {
  const response = await apiClient.put(ApiRoutes.discussion.create, {
    data,
  });

  if (response.status == 200 || response.status == 201) {
    return response.data;
  }
  return false;
}
