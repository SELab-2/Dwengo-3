import request from 'supertest';
import { describe, beforeEach, test, vi, expect, beforeAll } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockTeacherDomain } = vi.hoisted(() => {
  return {
    mockTeacherDomain: {
      getTeachers: vi.fn(),
      getTeacherById: vi.fn(),
    },
  };
});
vi.mock('../../domain/teacher.domain', () => {
  return {
    TeacherDomain: vi.fn().mockImplementation(() => {
      return mockTeacherDomain;
    }),
  };
});

const route = '/teacher';
const agent = request.agent(app);

describe('teacher routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /teacher', () => {
    test('Responds on getTeachers', async () => {
      const query = { classId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getTeachers' };
      mockTeacherDomain.getTeachers.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockTeacherDomain.getTeachers).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /teacher/:id', () => {
    test('Responds on getTeacherById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getTeacherById' };
      mockTeacherDomain.getTeacherById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockTeacherDomain.getTeacherById).toHaveBeenCalledWith(id);
    });
  });
});
