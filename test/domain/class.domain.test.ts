import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ClassDomain } from '../../server/domain/class.domain';
import {
  testClasses,
  testPaginationFilter,
  testStudents,
  testTeachers,
  testUsers,
} from '../testObjects.json';
import { UserEntity } from '../../server/util/types/user.types';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';

// class persistence mock
const { mockClassPeristence } = vi.hoisted(() => {
  return {
    mockClassPeristence: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
      updateClass: vi.fn(),
      isTeacherFromClass: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/class.persistence', () => ({
  ClassPersistence: vi.fn().mockImplementation(() => {
    return mockClassPeristence;
  }),
}));

const classDomain = new ClassDomain();

// test data
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

let getClassesEmptyQuery = { ...testPaginationFilter };
let getClassesTeacherQuery = { ...testPaginationFilter, teacherId: testTeachers[0].id };
let getClassesOtherTeacherQuery = { ...testPaginationFilter, teacherId: testTeachers[1].id };
let getClassesStudentQuery = { ...testPaginationFilter, studentId: testStudents[0].id };
let getClassesOtherStudentQuery = { ...testPaginationFilter, studentId: testStudents[1].id };
let getClassesTeacherInvalidPaginationQuery = {
  ...testPaginationFilter,
  page: '-1',
  teacherId: testTeachers[0].id,
};

let getClassByIdId = testClasses[0].id;
let getClassByIdUserDoesntBelongId = testClasses[2].id;
let existingClasses = testClasses;

let createClassParams = { name: 'class0' };
let createClassInvalidParams = { name: '' };

let updateClassParams = { name: 'class0' };
let updateClassInvalidIdParams = { id: 'id', name: 'class0' };
let updateClassInvalidNameParams = { id: 'id', name: '' };
let updateClassTeacherDoesntBelongParams = { id: testClasses[1].id, name: 'class0' };

// tests
describe('class domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('getClasses', () => {
    beforeEach(() => {
      mockClassPeristence.getClasses.mockImplementation(() => {
        return testClasses;
      });
    });
    test('teacher id provided and corresponds with user teacher id passes', async () => {
      await expect(
        classDomain.getClasses(getClassesTeacherQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('student id provided and corresponds with user student id passes', async () => {
      await expect(
        classDomain.getClasses(getClassesStudentQuery, userStudent),
      ).resolves.not.toThrow();
    });
    test('student id provided and user is teacher passes', async () => {
      await expect(
        classDomain.getClasses(getClassesStudentQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('teacher id provided and user is student passes', async () => {
      await expect(
        classDomain.getClasses(getClassesTeacherQuery, userStudent),
      ).resolves.not.toThrow();
    });
    test('invalid pagination fails', async () => {
      await expect(
        classDomain.getClasses(getClassesTeacherInvalidPaginationQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid filters fails', async () => {
      await expect(classDomain.getClasses({}, userStudent)).rejects.toThrow();
    });
    test('student id provided and user is student with other id fails', async () => {
      await expect(
        classDomain.getClasses(getClassesOtherStudentQuery, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40004 });
    });
    test('teacher id provided and user is teacher with other id fails', async () => {
      await expect(
        classDomain.getClasses(getClassesOtherTeacherQuery, userTeacher),
      ).rejects.toMatchObject({ _errorCode: 40004 });
    });
  });
  describe('getClassById', () => {
    beforeEach(() => {
      mockClassPeristence.getClassById.mockImplementation((id: string) => {
        let found = existingClasses.find((c) => c.id === id);
        if (found) {
          return found;
        }
        return null;
      });
    });
    test('student belongs to class passes', async () => {
      await expect(classDomain.getClassById(getClassByIdId, userStudent)).resolves.not.toThrow();
    });
    test('teacher belongs to class passes', async () => {
      await expect(classDomain.getClassById(getClassByIdId, userTeacher)).resolves.not.toThrow();
    });
    test('student does not belong to class fails', async () => {
      await expect(
        classDomain.getClassById(getClassByIdUserDoesntBelongId, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40002 });
    });
    test('teacher does not belong to class fails', async () => {
      await expect(
        classDomain.getClassById(getClassByIdUserDoesntBelongId, userTeacher),
      ).rejects.toMatchObject({ _errorCode: 40001 });
    });
  });
  describe('createClass', () => {
    beforeEach(() => {});
    test('user is teacher and valid param passes', async () => {
      await expect(classDomain.createClass(createClassParams, userTeacher)).resolves.not.toThrow();
    });
    test('user is student fails', async () => {
      await expect(classDomain.createClass(createClassParams, userStudent)).rejects.toMatchObject({
        _errorCode: 40005,
      });
    });
    test('invalid param fails', async () => {
      await expect(
        classDomain.createClass(createClassInvalidParams, userTeacher),
      ).rejects.toThrow();
    });
  });
  describe('updateClass', () => {
    beforeEach(() => {
      mockClassPeristence.isTeacherFromClass.mockImplementation((teacherId, classId) => {
        return existingClasses.some(
          (c) => c.id === classId && c.teachers.some((t) => t.id === teacherId),
        );
      });
    });
    test('user is teacher of class and valid params passes', async () => {
      await expect(
        classDomain.updateClass(testClasses[0].id, updateClassParams, userTeacher),
      ).resolves.not.toThrow();
    });
    test('invalid id param fails', async () => {
      await expect(
        classDomain.updateClass(testClasses[0].id, updateClassInvalidIdParams, userStudent),
      ).rejects.toThrow();
    });
    test('invalid name param fails', async () => {
      await expect(
        classDomain.updateClass(testClasses[0].id, updateClassInvalidNameParams, userTeacher),
      ).rejects.toThrow();
    });
    test('user is not teacher of class fails', async () => {
      await expect(
        classDomain.updateClass(
          testClasses[1].id,
          updateClassTeacherDoesntBelongParams,
          userTeacher,
        ),
      ).rejects.toMatchObject({ _errorCode: 40006 });
    });
    test('user is student fails', async () => {
      await expect(
        classDomain.updateClass(testClasses[0].id, updateClassParams, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40006 });
    });
  });
});
