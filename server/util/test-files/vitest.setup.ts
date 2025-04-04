import dotenv from 'dotenv';
import { vi } from 'vitest';
import * as crypto from 'node:crypto';

dotenv.config({ path: '../.env' });

vi.mock('../../domain/user.domain', () => ({
  UserDomain: vi.fn().mockImplementation(() => ({
    getUserByEmail: vi.fn(async (email) => ({
      id: 'test-id',
      email,
      name: 'Test',
      password: crypto.createHash('sha256').update('password123').digest('base64'),
      provider: 'LOCAL',
      surname: 'User',
      username: 'testuser',
      role: 'TEACHER',
      teacher: null,
      student: null,
    })),
    getUserFromReq: vi.fn(() => ({ test: 'test' })),
    getUserById: vi.fn(() => ({ test: 'test' })),
  })),
}));
