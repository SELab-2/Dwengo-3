import request from 'supertest';
import { describe, beforeEach, test, vi } from 'vitest';
import { app } from '../../../server/app';
import path from 'path';

// Domain mock
const { mockClassDomain } = vi.hoisted(() => {
  return {
    mockClassDomain: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
      updateClass: vi.fn(),
      deleteClass: vi.fn(),
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
const route: string = '/api/class';

// Tests
describe('class routes test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /class/id', async () => {
    test('responds on id', async () => {
      const id: string = 'id';
      const expected = { id: id, name: 'name' };
      mockClassDomain.getClassById.mockResolvedValue(expected);
      await request(app).get(path.join(route, id)).expect(200);
      // TODO hier moet nog de response value gecheckt worden
    });
  });

  describe('POST /class', async () => {
    test('responds on payload', async () => {
      const body = { name: 'name' };
      mockClassDomain.getClassById.mockResolvedValue({ ...body, id: 'id' });
      await request(app).post(path.join(route)).send(body).expect(200);
      // TODO hier moet nog de response value worden gecheckt
    });
  });
});
