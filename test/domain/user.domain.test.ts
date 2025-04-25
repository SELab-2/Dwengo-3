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
  describe('loginUser', () => {
    beforeEach(() => {
      mockUserPeristence.getUserByEmail.mockImplementation((email: string) => {
        if (email === loginUser.email) {
          return loginUser;
        }
        return null;
        loginRequest = { email: testUsers[0].email, password: testUsers[0].password };
      });
    });
    test('existing user passes', async () => {
      await expect(userDomain.loginUser(loginRequest)).resolves.toBeDefined();
    });
    test('nonexisting user fails', async () => {
      loginRequest = { ...loginRequest, email: 'user0@example.com' };
      await expect(userDomain.loginUser(loginRequest)).rejects.toThrow();
    });
  });
  /*
    describe('expectUserRole', () => {
        beforeEach(() => {
            mockUserPeristence.getUserRoleById.mockImplementation((id: string) => {
                if (id === expectedRoleUser.id) {
                    return { role: expectedRoleUser.role as ClassRoleEnum };
                }
                return null;
                expectedId = testUsers[0].id
                expectedRole = testUsers[0].role as ClassRoleEnum
            });
        });
        test('existing user and expected role passes', async () => {
            await expect(userDomain.expectUserRole(expectedId, expectedRole)).resolves.not.Throw
        });
        test('nonexisting user fails', async () => {
            expectedId = '2b3c4d5e-2222-3333-4444-555566667777'
            await expect(userDomain.expectUserRole(expectedId, expectedRole)).rejects.toThrow()
        });
        test('unexpected role fails', async () => {
            expectedRole = 'STUDENT' as ClassRoleEnum
            await expect(userDomain.expectUserRole(expectedId, expectedRole)).rejects.toThrow()
        });
    });
    */
});
