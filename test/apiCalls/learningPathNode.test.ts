import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createLearningPathNode,
  fetchLearningPathNodeById,
} from '../../client/src/api/learningPathNode';

describe('Test learningPathNodeApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create learningPathNode', async () => {
    const expected = { data: 'Create learningPathNode' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockLearningPathNode = {
      learningPathId: '123',
      learningObjectId: '456',
      instruction: 'do something',
    };

    const response = await createLearningPathNode(mockLearningPathNode);

    expect(apiClient.put).toHaveBeenCalledWith(
      ApiRoutes.learningPathNode.create,
      mockLearningPathNode,
    );
    expect(response).toEqual(expected.data);
  });

  test('Fetch a learningPathNode by its id', async () => {
    const expected = { data: 'Fetch learningPathNode id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchLearningPathNodeById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.learningPathNode.get(id), {
      signal: undefined,
    });
    expect(response).toEqual(expected.data);
  });
});
