import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockClassDomain } = vi.hoisted(() => {
  return {
    mockClassDomain: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
      updateClass: vi.fn(),
      removeTeacherFromClass: vi.fn(),
      removeStudentFromClass: vi.fn(),
    },
  };
});
vi.mock('../../domain/class.domain', () => {
  return {
    ClassDomain: vi.fn().mockImplementation(() => {
      return mockClassDomain;
    }),
  };
});

// Global test variables
const route: string = '/class';
const agent = request.agent(app);

// Tests
describe('class routes test', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /class', () => {
    test('Responds on getClasses', async () => {
      const query = { teacherId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getClasses' };
      mockClassDomain.getClasses.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockClassDomain.getClasses).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /class/:id', () => {
    test('Responds on getId', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getClassById' };
      mockClassDomain.getClassById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockClassDomain.getClassById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });

  describe('PUT /class', () => {
    test('Responds on createClass', async () => {
      const body = { name: 'testname' };
      const expected = { endpoint: 'createClass' };
      mockClassDomain.createClass.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockClassDomain.createClass).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });

  describe('PATCH /class/:id', () => {
    test('Responds on updateClass', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const body = { name: 'testname' };
      const expected = { endpoint: 'updateClass' };
      mockClassDomain.updateClass.mockResolvedValue(expected);

      await agent.patch(`${route}/${id}`).send(body).expect(200, expected);

      expect(mockClassDomain.updateClass).toHaveBeenCalledWith(id, body, expect.any(Object));
    });
  });

  describe('DELETE /class/:id/teacher/:teacherId', () => {
    test('Responds on deleteTeacherFromClass', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const teacherId = '660e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'deleteTeacherFromClass' };
      mockClassDomain.removeTeacherFromClass.mockResolvedValue(expected);

      await agent.delete(`${route}/${id}/teacher/${teacherId}`).expect(200);

      expect(mockClassDomain.removeTeacherFromClass).toHaveBeenCalledWith(
        id,
        teacherId,
        expect.any(Object),
      );
    });
  });

  describe('DELETE /class/:id/student/:studentId', () => {
    test('Responds on deleteStudenFromClass', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const studentId = '770e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'removeStudentFromClass' };
      mockClassDomain.removeStudentFromClass.mockResolvedValue(expected);

      await agent.delete(`${route}/${id}/student/${studentId}`).expect(200);

      expect(mockClassDomain.removeStudentFromClass).toHaveBeenCalledWith(
        id,
        studentId,
        expect.any(Object),
      );
    });
  });
});
