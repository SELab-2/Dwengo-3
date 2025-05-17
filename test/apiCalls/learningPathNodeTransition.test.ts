import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import { createLearningPathNodeTransition } from '../../client/src/api/learningPathNodeTransition';

describe('Test learningPathNodeTransitionApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create learningPathNodeTransition', async () => {
    const expected = { data: 'Create learningPathNodeTransition' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockLearningPathNodeTransition = {
      learningPathNodeId: '123',
      toNodeIndex: 5,
      condition: 'condition',
    };

    const response = await createLearningPathNodeTransition(mockLearningPathNodeTransition);

    expect(apiClient.put).toHaveBeenCalledWith(
      ApiRoutes.learningPathNodeTransition.create,
      mockLearningPathNodeTransition,
    );
    expect(response).toEqual(expected.data);
  });
});
