import { beforeEach, describe, expect, test, vi } from 'vitest';
import { UserDomain } from '../../server/domain/user.domain';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  UserEntity,
} from '../../server/util/types/user.types';
import {
  testDiscussions,
  testPaginationFilter,
  testTeachers,
  testStudents,
  testUsers,
  testMessages,
  testGroups,
  testCreateUsers,
} from '../testObjects.json';

const { mockUsersPeristence } = vi.hoisted(() => {
  return {
    mockUsersPeristence: {
      saveUser: vi.fn(),
      getUserById: vi.fn(),
      getUserByEmail: vi.fn(),
      deleteUser: vi.fn(),
      getUserRoleById: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/auth/users.persistence', () => ({
  UsersPersistence: vi.fn().mockImplementation(() => {
    return mockUsersPeristence;
  }),
}));

const userDomain = new UserDomain();
let userTeacher: UserEntity = {
  ...testUsers[0],
  role: testUsers[0].role as ClassRoleEnum,
  teacher: testTeachers[0],
  provider: AuthenticationProvider.LOCAL,
};
let userStudent: UserEntity = {
  ...testUsers[5],
  role: testUsers[5].role as ClassRoleEnum,
  student: testStudents[0],
  provider: AuthenticationProvider.LOCAL,
};

let createUserParams = {
  ...testCreateUsers[1],
  provider: AuthenticationProvider.LOCAL,
  role: testCreateUsers[1].role as ClassRoleEnum,
};
let createUserNoEmailParams = {
  ...createUserParams,
  email: '',
};
let createUserEmailExistsParams = {
  ...createUserParams,
  email: testUsers[5].email,
};

let getUserByEmailEmail = testUsers[5].email;
let getUserByEmailNoEmail = '';

// Tests
describe('user domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUsersPeristence.getUserByEmail.mockImplementation((email: string) => {
      let found = testUsers.find((u) => u.email === email);
      if (found) {
        return found;
      }
      return null;
    });
    mockUsersPeristence.getUserById.mockImplementation((id: string) => {
      let found = testUsers.find((u) => u.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockUsersPeristence.saveUser.mockImplementation(() => {
      return {
        email: 'email',
        id: 'id',
        name: 'name',
        password: 'password',
        provider: 'LOCAL',
        role: 'STUDENT',
        student: {},
        surname: 'surname',
        teacher: {},
        username: 'username',
      };
    });
  });
  describe('createUser', () => {
    test('valid params passes', async () => {
      await expect(userDomain.createUser(createUserParams)).resolves.not.toThrow();
    });
    test('no email fails', async () => {
      await expect(userDomain.createUser(createUserNoEmailParams)).rejects.toMatchObject({
        _errorCode: 40045,
      });
    });
    test('email already belongs to user fails', async () => {
      await expect(userDomain.createUser(createUserEmailExistsParams)).rejects.toMatchObject({
        _errorCode: 40046,
      });
    });
  });
  describe('getUserByEmail', () => {
    test('valid email passes', async () => {
      await expect(userDomain.getUserByEmail(getUserByEmailEmail)).resolves.not.toThrow();
    });
    test('no email fails', async () => {
      await expect(userDomain.getUserByEmail(getUserByEmailNoEmail)).rejects.toMatchObject({
        _errorCode: 40045,
      });
    });
  });
});
