import { beforeEach, describe, expect, test, vi } from 'vitest';
import {} from '../testObjects.json';
import * as userDomain from '../../server/domain/user.domain';
import { testUsers } from '../testObjects.json';
import { ClassRoleEnum } from '../../server/util/types/user.types';

// user persistence mock
const { mockUserPeristence } = vi.hoisted(() => {
  return {
    mockUserPeristence: {
      saveUser: vi.fn(),
      getUserById: vi.fn(),
      getUserByEmail: vi.fn(),
      deleteUser: vi.fn(),
      getUserRoleById: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/auth/users.persistance', () => mockUserPeristence);

let loginRequest = { email: testUsers[0].email, password: testUsers[0].password };
let loginUser = testUsers[0];
let expectedId = testUsers[0].id;
let expectedRole = testUsers[0].role as ClassRoleEnum;
let expectedRoleUser = testUsers[0];

describe('user domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
});
