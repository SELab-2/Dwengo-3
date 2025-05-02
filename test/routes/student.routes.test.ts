import request from 'supertest';
import { describe, beforeEach, test, vi, expect, beforeAll } from 'vitest';
import { app } from '../../server/app';

// Domain mock
const { mockStudentDomain } = vi.hoisted(() => {
  return {
    mockStudentDomain: {
      getStudents: vi.fn(),
      getStudentById: vi.fn(),
    },
  };
});
vi.mock('../../server/domain/student.domain', () => {
  return {
    StudentDomain: vi.fn().mockImplementation(() => {
      return mockStudentDomain;
    }),
  };
});

const route = '/student';
const agent = request.agent(app);

describe('student routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /student', () => {
    test('Responds on getStudents', async () => {
      const query = { classId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getStudents' };
      mockStudentDomain.getStudents.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockStudentDomain.getStudents).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /student/:id', () => {
    test('Responds on getStudentById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getStudentById' };
      mockStudentDomain.getStudentById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockStudentDomain.getStudentById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });
});
