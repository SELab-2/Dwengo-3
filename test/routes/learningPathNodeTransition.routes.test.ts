import request from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { app } from '../../server/app';

// Domain mock
const { mockLearningPathNodeTransitionDomain } = vi.hoisted(() => {
  return {
    mockLearningPathNodeTransitionDomain: {
      createLearningPathNodeTransition: vi.fn(),
    },
  };
});
vi.mock('../../server/domain/learningPathNodeTransition.domain', () => {
  return {
    LearningPathNodeTransitionDomain: vi.fn().mockImplementation(() => {
      return mockLearningPathNodeTransitionDomain;
    }),
  };
});

const route = '/learningPathNodeTransition';
const agent = request.agent(app);

describe('learningPathNodeTransition routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('PUT /learningPathNodeTransition', () => {
    test('Responds on createLearningPathNodeTransition', async () => {
      const body = {
        learningPathNodeId: '550e8400-e29b-41d4-a716-446655440002',
        toNodeIndex: 2,
        condition: "answer == 'B'",
      };
      const expected = { endpoint: 'createLearningPathNodeTransition' };
      mockLearningPathNodeTransitionDomain.createLearningPathNodeTransition.mockResolvedValue(
        expected,
      );

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(
        mockLearningPathNodeTransitionDomain.createLearningPathNodeTransition,
      ).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });
});
