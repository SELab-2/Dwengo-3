import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createDiscussion,
  fetchDiscussionById,
  fetchDiscussions,
} from '../../client/src/api/discussion';

describe('Test discussionApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create discussion', async () => {
    const expected = { data: 'Create discussion' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockDiscussion = {
      groupId: '123',
    };

    const response = await createDiscussion(mockDiscussion);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.discussion.create, mockDiscussion);
    expect(response).toEqual(expected.data);
  });

  test('Fetch a discussion by its id', async () => {
    const expected = { data: 'Fetch discussion id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchDiscussionById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.discussion.get(id));
    expect(response).toEqual(expected.data);
  });
});
