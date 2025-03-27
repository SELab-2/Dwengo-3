import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockAssignmentDomain } = vi.hoisted(() => {
  return {
    mockAssignmentDomain: {
      getAssignments: vi.fn(),
      getAssignmentById: vi.fn(),
      createAssignment: vi.fn(),
    },
  };
});
vi.mock('../../domain/assignment.domain', () => {
  return {
    AssignmentDomain: vi.fn().mockImplementation(() => {
      return mockAssignmentDomain;
    }),
  };
});

const route = '/api/assignment';

describe('assignment routes test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /assignment', () => {
    test('Responds on getAssignment', async () => {
      const query = { teacherId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getAssignment' };
      mockAssignmentDomain.getAssignments.mockResolvedValue(expected);

      await request(app).get(`${route}`).query(query).expect(200, expected);

      expect(mockAssignmentDomain.getAssignments).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /assignment/:id', () => {
    test('Responds on getAssignmentById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getAssignmentById' };
      mockAssignmentDomain.getAssignmentById.mockResolvedValue(expected);

      await request(app).get(`${route}/${id}`).expect(200, expected);

      expect(mockAssignmentDomain.getAssignmentById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });

  describe('PUT /assignment', () => {
    test('Responds on createAssignment', async () => {
      const body = {
        groups: [['550e8400-e29b-41d4-a716-446655440000']],
        learningPathId: '550e8400-e29b-41d4-a716-446655440000',
        classId: '550e8400-e29b-41d4-a716-446655440000',
        teacherId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const expected = { endpoint: 'createAssignment' };
      mockAssignmentDomain.createAssignment.mockResolvedValue(expected);

      await request(app).put(`${route}`).send(body).expect(200, expected);

      expect(mockAssignmentDomain.createAssignment).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });
});
