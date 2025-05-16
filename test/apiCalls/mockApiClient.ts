import { vi } from 'vitest';

vi.mock('../../client/src/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));
