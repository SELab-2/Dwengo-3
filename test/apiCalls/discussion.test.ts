import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createDiscussion,
  fetchDiscussionById,
  fetchDiscussions,
  updateDiscussion,
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

  test('Fetch discussions', async () => {
    const expected = { data: 'Fetch discussions' };
    (apiClient.get as any).mockResolvedValue(expected);
    const userId = '123';
    const assignmentId = '456';
    const page = 1;
    const pageSize = 10;

    const response = await fetchDiscussions(userId, assignmentId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.discussion.list, {
      params: {
        userId,
        assignmentId,
        page,
        pageSize,
      },
    });
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

  test('Update discussion', async () => {
    const expected = { data: 'Update discussion' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockDiscussion = {
      groupId: '1213',
    };
    const id = '456';

    const response = await updateDiscussion(id, mockDiscussion);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.discussion.update(id), {
      data: mockDiscussion,
    });
    expect(response).toEqual(expected.data);
  });
});
