import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockFavoritesDomain } = vi.hoisted(() => {
  return {
    mockFavoritesDomain: {
      getFavorites: vi.fn(),
      getFavoriteById: vi.fn(),
      createFavorite: vi.fn(),
      deleteFavorite: vi.fn(),
    },
  };
});
vi.mock('../../domain/favorites.domain', () => {
  return {
    FavoritesDomain: vi.fn().mockImplementation(() => {
      return mockFavoritesDomain;
    }),
  };
});

const route = '/favorites';
const agent = request.agent(app);

describe('favorites routes test', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /favorites', () => {
    test('Responds on getFavorites', async () => {
      const query = { userId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getFavorites' };
      mockFavoritesDomain.getFavorites.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockFavoritesDomain.getFavorites).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /favorites/:id', () => {
    test('Responds on getFavoriteById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getFavoriteById' };
      mockFavoritesDomain.getFavoriteById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockFavoritesDomain.getFavoriteById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });

  describe('PUT /favorites', () => {
    test('Responds on createFavorite', async () => {
      const body = { learningPathId: '660e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'createFavorite' };
      mockFavoritesDomain.createFavorite.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200);

      expect(mockFavoritesDomain.createFavorite).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });

  describe('DELETE /favorites', () => {
    test('Responds on deleteFavorite', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'deleteFavorite' };
      mockFavoritesDomain.deleteFavorite.mockResolvedValue(expected);

      await agent.delete(`${route}/${id}`).expect(200, expected);

      expect(mockFavoritesDomain.deleteFavorite).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });
});
