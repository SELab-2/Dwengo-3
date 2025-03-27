import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockStudentDomain } = vi.hoisted(() => {
  return {
    mockStudentDomain: {
      getStudents: vi.fn(),
      getStudentById: vi.fn(),
    },
  };
});
vi.mock('../../domain/student.domain', () => {
  return {
    StudentDomain: vi.fn().mockImplementation(() => {
      return mockStudentDomain;
    }),
  };
});

const route = '/api/student';

describe('student routes test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /student', () => {
    test('Responds on getStudents', async () => {
      const query = { classId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getStudents' };
      mockStudentDomain.getStudents.mockResolvedValue(expected);

      await request(app).get(`${route}`).query(query).expect(200, expected);

      expect(mockStudentDomain.getStudents).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /student/:id', () => {
    test('Responds on getStudentById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getStudentById' };
      mockStudentDomain.getStudentById.mockResolvedValue(expected);

      await request(app).get(`${route}/${id}`).expect(200, expected);

      expect(mockStudentDomain.getStudentById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });
});
