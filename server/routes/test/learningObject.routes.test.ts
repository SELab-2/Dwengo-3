import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockLearningObjectDomain } = vi.hoisted(() => {
  return {
    mockLearningObjectDomain: {
      getLearningObjects: vi.fn(),
      getLearningObjectById: vi.fn(),
      createLearningObject: vi.fn(),
      updateLearningObject: vi.fn(),
      deleteLearningObject: vi.fn(),
    },
  };
});
vi.mock('../../domain/learningObject.domain', () => {
  return {
    LearningObjectDomain: vi.fn().mockImplementation(() => {
      return mockLearningObjectDomain;
    }),
  };
});

const route = '/learningObject';
const agent = request.agent(app);

describe('learningObject routes test', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /learningObject', () => {
    test('Responds on getLearningObjects', async () => {
      const query = { keywords: ['programming', 'python'] };
      const expected = { endpoint: 'getLearningObjects' };
      mockLearningObjectDomain.getLearningObjects.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockLearningObjectDomain.getLearningObjects).toHaveBeenCalledWith(query);
    });
  });

  describe('GET /learningObject/:id', () => {
    test('Responds on getLearningObjectById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getLearningObjectById' };
      mockLearningObjectDomain.getLearningObjectById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockLearningObjectDomain.getLearningObjectById).toHaveBeenCalledWith(id);
    });
  });

  describe('PUT /learningObject', () => {
    test('Responds on createLearningObject', async () => {
      const body = {
        hruid: 'intro-to-programming',
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        version: 1,
        language: 'en',
        title: 'Introduction to Programming',
        description: 'A beginner-friendly learning object for programming.',
        contentType: 'TEXT_MARKDOWN',
        targetAges: [12, 14],
        teacherExclusive: false,
        skosConcepts: ['https//example.com'],
        educationalGoals: [
          {
            goal: 'Understand variables',
          },
        ],
        copyright: '© 2023 Dwengo',
        licence: 'MIT',
        difficulty: 3,
        estimatedTime: 60,
        returnValue: {
          callback: 'https://example.com',
        },
        available: true,
        createdAt: '2023-06-25T10:00:00Z',
        updatedAt: '2023-06-25T10:00:00Z',
        content: 'This is the content of the learning object.',
        multipleChoice: {
          question: 'What is 2 + 2?',
          options: ['2', '4', '6'],
          answer: '4',
        },
        canUploadSubmission: false,
        keywords: ['string'],
      };
      const expected = { endpoint: 'createLearningObject' };
      mockLearningObjectDomain.createLearningObject.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockLearningObjectDomain.createLearningObject).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });

  describe('PATCH /learningObject/:id', () => {
    test('Responds on updateLearningObject', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const body = {
        version: 1,
        title: 'Introduction to Algebra',
        description: 'This module introduces algebraic concepts.',
        contentType: 'AUDIO_MPEG',
        targetAges: [10, 12, 14],
        teacherExclusive: false,
        skosConcepts: ['Algebra', 'Mathematics'],
        educationalGoals: [{}],
        copyright: '© 2025 Learning Corp.',
        licence: 'CC BY-NC-SA 4.0',
        difficulty: 3,
        estimatedTime: 1.5,
        returnValue: {},
        available: true,
        content: 'Algebraic equations introduction...',
        multipleChoice: {},
        canUploadSubmission: true,
        keywords: ['string'],
      };
      const expected = { endpoint: 'updateLearningObject' };
      mockLearningObjectDomain.updateLearningObject.mockResolvedValue(expected);

      await agent.patch(`${route}/${id}`).send(body).expect(200, expected);

      expect(mockLearningObjectDomain.updateLearningObject).toHaveBeenCalledWith(
        id,
        body,
        expect.any(Object),
      );
    });
  });

  describe('DELETE /learningObject/:id', () => {
    test('Responds on deleteLearningObject', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'deleteLearningObject' };
      mockLearningObjectDomain.deleteLearningObject.mockResolvedValue(expected);

      await agent.delete(`${route}/${id}`).expect(200, expected);

      expect(mockLearningObjectDomain.deleteLearningObject).toHaveBeenCalledWith(
        id,
        expect.any(Object),
      );
    });
  });
});
