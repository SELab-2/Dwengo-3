import { beforeEach, describe, expect, test, vi } from 'vitest';
import {} from '../testObjects.json';
import { TeacherDomain } from '../../server/domain/teacher.domain';
import {
  testTeachers,
  testUsers,
  testStudents,
  testClasses,
  testPaginationFilter,
} from '../testObjects.json';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  UserEntity,
} from '../../server/util/types/user.types';

// teacher persistence mock
const { mockTeacherPeristence } = vi.hoisted(() => {
  return {
    mockTeacherPeristence: {
      createTeacher: vi.fn(),
      getTeachers: vi.fn(),
      getTeacherById: vi.fn(),
      getTeacherByUserId: vi.fn(),
      updateTeacher: vi.fn(),
      deleteTeacher: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/teacher.persistence', () => ({
  TeacherPersistence: vi.fn().mockImplementation(() => {
    return mockTeacherPeristence;
  }),
}));
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
vi.mock('../../../server/persistence/auth/users.persistance', () => mockUserPeristence);

const teacherDomain = new TeacherDomain();

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

let createUser = testUsers[0];
let createExistingUsers = [createUser, testUsers[1]];
let createTeacherResult = testTeachers[0];

let getTeachersEmptyQuery = { ...testPaginationFilter };
let getTeachersQuery = {
  ...testPaginationFilter,
  userId: testUsers[0].id,
  classId: testClasses[0].id,
  classes: true,
};
let getTeachersInvalidPaginationQuery = {
  ...testPaginationFilter,
  page: '-1',
};
let getTeachersInvalidUserIdQuery = { ...testPaginationFilter, userId: '' };
let getTeachersInvalidClassIdQuery = { ...testPaginationFilter, classId: '' };
let getTeachersInvalidIncludeQuery = { ...testPaginationFilter, classes: '' };

let updateTeacherParams1 = {
  id: testTeachers[0].id,
  classes: testClasses.map((c) => c.id),
};
let updateTeacherParams2 = {
  id: testTeachers[0].id,
};
let updateTeacherInvalidIdParam = {
  id: '',
  classes: [testClasses[0]],
};
let updateTeacherInvalidClassesParam = {
  id: testTeachers[0].id,
  classes: ['class'],
};

let deleteTeacherParams = { id: testTeachers[0].id };
let deleteTeacherInvalidParams = { id: '' };

// Tests
describe('teacher domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('createTeacher', () => {
    beforeEach(() => {
      createUser = testUsers[0];
      createExistingUsers = [createUser, testUsers[1]];
      createTeacherResult = testTeachers[0];
      mockTeacherPeristence.createTeacher.mockImplementation((userId: string) => {
        return { ...createTeacherResult, userId: userId };
      });
      mockUserPeristence.getUserById.mockImplementation((userId: string) => {
        let found = createExistingUsers.find((user) => user.id === userId);
        if (found) {
          return found;
        }
        return null;
      });
    });
    test('valid params, user exists and no role passes', async () => {
      await expect(teacherDomain.createTeacher({ userId: createUser.id })).resolves.toBeDefined();
    });
    test('invalid params fails', async () => {
      createUser.id = 'id';
      await expect(teacherDomain.createTeacher({ userId: createUser.id })).rejects.toThrow();
    });
    test('unexisting user fails', async () => {
      createExistingUsers = [testUsers[1]];
      mockUserPeristence.getUserById.mockImplementation((userId: string) => {
        let found = createExistingUsers.find((user) => user.id === userId);
        if (found) {
          return found;
        }
        return null;
      });
      await expect(teacherDomain.createTeacher({ userId: createUser.id })).rejects.toThrow();
    });
    test('user is already teacher fails', async () => {
      let roleCreateUser = { ...createUser, role: 'TEACHER', teacher: testTeachers[0] };
      createExistingUsers = [roleCreateUser, testUsers[1]];
      mockUserPeristence.getUserById.mockImplementation((userId: string) => {
        let found = createExistingUsers.find((user) => user.id === userId);
        if (found) {
          return found;
        }
        return null;
      });
      await expect(teacherDomain.createTeacher({ userId: createUser.id })).rejects.toThrow();
    });
    test('user is already student fails', async () => {
      let roleCreateUser = { ...createUser, role: 'STUDENT', teacher: testTeachers[0] };
      createExistingUsers = [roleCreateUser, testUsers[1]];
      mockUserPeristence.getUserById.mockImplementation((userId: string) => {
        let found = createExistingUsers.find((user) => user.id === userId);
        if (found) {
          return found;
        }
        return null;
      });
      await expect(teacherDomain.createTeacher({ userId: createUser.id })).rejects.toThrow();
    });
  });
  describe('getTeachers', () => {
    test('valid pagination and no params passes', async () => {
      await expect(
        teacherDomain.getTeachers(getTeachersEmptyQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('valid pagination and valid params passes', async () => {
      await expect(teacherDomain.getTeachers(getTeachersQuery, userTeacher)).resolves.not.toThrow();
    });
    test('invalid pagination fails', async () => {
      await expect(
        teacherDomain.getTeachers(getTeachersInvalidPaginationQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid user id param fails', async () => {
      await expect(
        teacherDomain.getTeachers(getTeachersInvalidUserIdQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid class id param fails', async () => {
      await expect(
        teacherDomain.getTeachers(getTeachersInvalidClassIdQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid classes include param fails', async () => {
      await expect(
        teacherDomain.getTeachers(getTeachersInvalidIncludeQuery, userTeacher),
      ).rejects.toThrow();
    });
  });
});
