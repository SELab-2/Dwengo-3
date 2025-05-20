import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ClassJoinRequestDomain } from '../../server/domain/classJoinRequest.domain';
import {
  testClasses,
  testClassJoinRequests,
  testPaginationFilter,
  testStudents,
  testTeachers,
  testUsers,
} from '../testObjects.json';
import { UserEntity } from '../../server/util/types/user.types';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';

const { mockClassJoinRequestPeristence, mockClassPeristence } = vi.hoisted(() => {
  return {
    mockClassJoinRequestPeristence: {
      createClassJoinRequest: vi.fn(),
      checkIfJoinRequestExists: vi.fn(),
      getJoinRequests: vi.fn(),
      handleJoinRequest: vi.fn(),
      isTeacherOfClassFromRequest: vi.fn(),
    },
    mockClassPeristence: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
      updateClass: vi.fn(),
      isTeacherFromClass: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/classJoinRequest.persistence', () => ({
  ClassJoinRequestPersistence: vi.fn().mockImplementation(() => {
    return mockClassJoinRequestPeristence;
  }),
}));
vi.mock('../../server/persistence/class.persistence', () => ({
  ClassPersistence: vi.fn().mockImplementation(() => {
    return mockClassPeristence;
  }),
}));

const classJoinRequestDomain = new ClassJoinRequestDomain();

// test data
let userTeacher: UserEntity = {
  ...testUsers[0],
  role: testUsers[0].role as ClassRoleEnum,
  teacher: testTeachers[0],
  provider: AuthenticationProvider.LOCAL,
};
let userTeacherOtherClass: UserEntity = {
  ...testUsers[1],
  role: testUsers[1].role as ClassRoleEnum,
  teacher: testTeachers[1],
  provider: AuthenticationProvider.LOCAL,
};
let userStudent: UserEntity = {
  ...testUsers[5],
  role: testUsers[5].role as ClassRoleEnum,
  student: testStudents[0],
  provider: AuthenticationProvider.LOCAL,
};
let userStudentOtherClass: UserEntity = {
  ...testUsers[7],
  role: testUsers[7].role as ClassRoleEnum,
  student: testStudents[2],
  provider: AuthenticationProvider.LOCAL,
};

let getJoinRequestTeacherQuery = {
  ...testPaginationFilter,
  userId: testTeachers[0].userId,
  classId: testClasses[0].id,
};
let getJoinRequestStudentQuery = {
  ...testPaginationFilter,
  userId: testStudents[0].userId,
};
let getJoinRequestTeacherInvalidUserIdQuery = {
  ...testPaginationFilter,
  userId: 'id',
  classId: testClasses[0].id,
};
let getJoinRequestTeacherInvalidClassIdQuery = {
  ...testPaginationFilter,
  userId: testTeachers[0].userId,
  classId: 'id',
};
let getJoinRequestEmptyQuery = { ...testPaginationFilter };
let getJoinRequestTeacherInvalidPaginationQuery = {
  ...testPaginationFilter,
  userId: testTeachers[0].userId,
  classId: testClasses[0].id,
  page: '-1',
};
let getJoinRequestStudentWithClassIdQuery = {
  ...testPaginationFilter,
  userId: testStudents[0].userId,
  classId: testClasses[0].id,
};
let getJoinRequestTeacherNotInClassQuery = {
  ...testPaginationFilter,
  userId: testTeachers[1].userId,
  classId: testClasses[0].id,
};

let createClassJoinRequestBody = { classId: testClasses[2].id };
let createClassJoinRequestInvalidIdBody = { classId: 'id' };
let createClassJoinRequestAlreadyExistsBody = { classId: testClasses[0].id };

let handleJoinRequestAcceptQuery = {
  requestId: testClassJoinRequests[0].id,
  decision: 'accept',
};
let handleJoinRequestDenyQuery = {
  requestId: testClassJoinRequests[0].id,
  decision: 'deny',
};
let handleJoinRequestInvalidRequestIdQuery = {
  requestId: 'id',
  decision: 'accept',
};
let handleJoinRequestInvalidDecisionQuery = {
  requestId: testClassJoinRequests[0].id,
  decision: 'test',
};

// tests
describe('classJoinRequest domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockClassPeristence.isTeacherFromClass.mockImplementation(
      (teacherId: string, classId: string) => {
        let found = testClasses.find(
          (c) => c.teachers.some((t) => t.id === teacherId) && c.id === classId,
        );
        if (found) {
          return found;
        }
        return null;
      },
    );
    mockClassJoinRequestPeristence.checkIfJoinRequestExists.mockImplementation(
      (classId: string, userId: string) => {
        let found = testClassJoinRequests.some((r) => r.classId === classId && r.userId === userId);
        return found;
      },
    );
    mockClassJoinRequestPeristence.isTeacherOfClassFromRequest.mockImplementation(
      (requestId: string, userId: string) => {
        let found = testClassJoinRequests.some((r) => r.id === requestId && r.userId === userId);
        return found;
      },
    );
  });
  describe('getJoinRequests', () => {
    test('valid teacher params passes', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestTeacherQuery,
          userTeacher,
          ClassRoleEnum.TEACHER,
        ),
      ).resolves.not.toThrow();
    });
    test('valid student params passes', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestStudentQuery,
          userStudent,
          ClassRoleEnum.STUDENT,
        ),
      ).resolves.not.toThrow();
    });
    test('invalid class id fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestTeacherInvalidClassIdQuery,
          userTeacher,
          ClassRoleEnum.TEACHER,
        ),
      ).rejects.toThrow();
    });
    test('invalid user id fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestTeacherInvalidUserIdQuery,
          userTeacher,
          ClassRoleEnum.TEACHER,
        ),
      ).rejects.toThrow();
    });
    test('empty query fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestEmptyQuery,
          userTeacher,
          ClassRoleEnum.TEACHER,
        ),
      ).rejects.toThrow();
    });
    test('invalid pagination params fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestTeacherInvalidPaginationQuery,
          userTeacher,
          ClassRoleEnum.TEACHER,
        ),
      ).rejects.toThrow();
    });
    test('get student request as teacher fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestTeacherQuery,
          userTeacher,
          ClassRoleEnum.STUDENT,
        ),
      ).rejects.toMatchObject({ _errorCode: 40013 });
    });
    test('get teacher request as student fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestStudentQuery,
          userStudent,
          ClassRoleEnum.TEACHER,
        ),
      ).rejects.toMatchObject({ _errorCode: 40012 });
    });
    test('param id doesnt match teacher user id fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestTeacherQuery,
          userTeacherOtherClass,
          ClassRoleEnum.TEACHER,
        ),
      ).rejects.toMatchObject({ _errorCode: 40015 });
    });
    test('param id doesnt match student user id fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestStudentQuery,
          userStudentOtherClass,
          ClassRoleEnum.STUDENT,
        ),
      ).rejects.toMatchObject({ _errorCode: 40017 });
    });
    test('get student request with class id fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestStudentWithClassIdQuery,
          userStudent,
          ClassRoleEnum.STUDENT,
        ),
      ).rejects.toMatchObject({ _errorCode: 40018 });
    });
    test('teacher does not belong to class fails', async () => {
      await expect(
        classJoinRequestDomain.getJoinRequests(
          getJoinRequestTeacherNotInClassQuery,
          userTeacherOtherClass,
          ClassRoleEnum.TEACHER,
        ),
      ).rejects.toMatchObject({ _errorCode: 40015 });
    });
  });
  describe('createClassJoinRequests', () => {
    test('valid id passes', async () => {
      await expect(
        classJoinRequestDomain.createClassJoinRequest(createClassJoinRequestBody, userTeacher),
      ).resolves.not.toThrow();
    });
    test('invalid id fails', async () => {
      await expect(
        classJoinRequestDomain.createClassJoinRequest(
          createClassJoinRequestInvalidIdBody,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
    test('request already exists fails', async () => {
      await expect(
        classJoinRequestDomain.createClassJoinRequest(
          createClassJoinRequestAlreadyExistsBody,
          userTeacher,
        ),
      ).rejects.toMatchObject({ _errorCode: 40014 });
    });
  });
  describe('handleJoinRequests', () => {
    test('valid accept handle passes', async () => {
      await expect(
        classJoinRequestDomain.handleJoinRequest(handleJoinRequestAcceptQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('valid deny handle passes', async () => {
      await expect(
        classJoinRequestDomain.handleJoinRequest(handleJoinRequestDenyQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('invalid request id fails', async () => {
      await expect(
        classJoinRequestDomain.handleJoinRequest(
          handleJoinRequestInvalidRequestIdQuery,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
    test('invalid decision fails', async () => {
      await expect(
        classJoinRequestDomain.handleJoinRequest(
          handleJoinRequestInvalidDecisionQuery,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
    test('user is student fails', async () => {
      await expect(
        classJoinRequestDomain.handleJoinRequest(handleJoinRequestAcceptQuery, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40019 });
    });
    test('user is not teacher of class from request fails', async () => {
      await expect(
        classJoinRequestDomain.handleJoinRequest(
          handleJoinRequestAcceptQuery,
          userTeacherOtherClass,
        ),
      ).rejects.toMatchObject({ _errorCode: 40020 });
    });
  });
});
