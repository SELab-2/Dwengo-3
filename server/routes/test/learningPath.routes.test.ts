import request from 'supertest';
import { describe, beforeEach, test, vi, expect, beforeAll } from 'vitest';
import { app } from '../../app';
import { mock } from 'node:test';

// Domain mock
const { mockLearningPathDomain } = vi.hoisted(() => {
  return {
    mockLearningPathDomain: {
      getLearningPaths: vi.fn(),
      getLearningPathById: vi.fn(),
      createLearningPath: vi.fn(),
    },
  };
});
vi.mock('../../domain/learningPath.domain', () => {
  return {
    LearningPathDomain: vi.fn().mockImplementation(() => {
      return mockLearningPathDomain;
    }),
  };
});

const route = '/learningPath';
const agent = request.agent(app);

describe('learningPath routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /learningPath', () => {
    test('Responds on getLearningPaths', async () => {
      const query = { keywords: ['programming', 'python'] };
      const expected = { endpoint: 'getLearningPaths' };
      mockLearningPathDomain.getLearningPaths.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockLearningPathDomain.getLearningPaths).toHaveBeenCalledWith(query);
    });
  });

  describe('GET /learningPath/:id', () => {
    test('Responds on getLearningPathById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getLearningPathById' };
      mockLearningPathDomain.getLearningPathById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockLearningPathDomain.getLearningPathById).toHaveBeenCalledWith(id);
    });
  });

  describe('PUT /learningPath', () => {
    test('Responds on createLearningPath', async () => {
      const body = {
        hruid: 'intro-to-programming',
        language: 'en',
        title: 'Introduction to Programming',
        description: 'A beginner-friendly learning path for programming.',
        image: 'string',
        createdAt: '2023-06-25T10:00:00Z',
        updatedAt: '2023-06-25T10:00:00Z',
      };
      const expected = { endpoint: 'createLearningPath' };
      mockLearningPathDomain.createLearningPath.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockLearningPathDomain.createLearningPath).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });
});
