import request from 'supertest';
import { describe, beforeEach, test, vi, expect, beforeAll } from 'vitest';
import { app } from '../../server/app';

// Domain mock
const { mockLearningPathNodeDomain } = vi.hoisted(() => {
  return {
    mockLearningPathNodeDomain: {
      getLearningPathNodeById: vi.fn(),
      createLearningPathNode: vi.fn(),
    },
  };
});
vi.mock('../../server/domain/learningPathNode.domain', () => {
  return {
    LearningPathNodeDomain: vi.fn().mockImplementation(() => {
      return mockLearningPathNodeDomain;
    }),
  };
});

const route = '/learningPathNode';
const agent = request.agent(app);

describe('learningPathNode routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /learningPathNode/:id', () => {
    test('Responds on getLearningPathNodeById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getLearningPathNodeById' };
      mockLearningPathNodeDomain.getLearningPathNodeById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockLearningPathNodeDomain.getLearningPathNodeById).toHaveBeenCalledWith(id);
    });
  });

  describe('PUT /learningPathNode', () => {
    test('Responds on createLearningPathNode', async () => {
      const body = {
        learningPathId: '550e8400-e29b-41d4-a716-446655440000',
        learningObjectId: '550e8400-e29b-41d4-a716-446655440002',
        instruction: 'Complete the exercises in this section.',
      };
      const expected = { endpoint: 'createLearningPathNode' };
      mockLearningPathNodeDomain.createLearningPathNode.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockLearningPathNodeDomain.createLearningPathNode).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });
});
