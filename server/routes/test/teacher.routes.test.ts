import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
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

const route = '/api/teacher';

describe('teacher routes test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /teacher', () => {
    test('Responds on getTeachers', async () => {
      const query = { classId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getTeachers' };
      mockTeacherDomain.getTeachers.mockResolvedValue(expected);

      await request(app).get(`${route}`).query(query).expect(200, expected);

      expect(mockTeacherDomain.getTeachers).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /teacher/:id', () => {
    test('Responds on getTeacherById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getTeacherById' };
      mockTeacherDomain.getTeacherById.mockResolvedValue(expected);

      await request(app).get(`${route}/${id}`).expect(200, expected);

      expect(mockTeacherDomain.getTeacherById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });
});
