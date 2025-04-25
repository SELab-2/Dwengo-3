import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ClassDomain } from '../../server/domain/class.domain';
import {
  testClasses,
  testPaginationFilter,
  testTeachers,
  testStudents,
  testUsers,
} from '../testObjects.json';
import { ClassRoleEnum, UserEntity } from '../../server/util/types/user.types';

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
};
let userStudent: UserEntity = {
  ...testUsers[5],
  role: testUsers[5].role as ClassRoleEnum,
  student: testStudents[0],
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

let updateClassParams = { id: testClasses[0].id, name: 'class0' };
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
      /*
            mockClassPeristence.getClasses.mockImplementation(() => {
                return [testClasses[0]]
            });
            */
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
      await expect(classDomain.getClasses(getClassesEmptyQuery, userStudent)).rejects.toThrow();
    });
    test('student id provided and user is student with other id fails', async () => {
      await expect(
        classDomain.getClasses(getClassesOtherStudentQuery, userStudent),
      ).rejects.toThrow();
    });
    test('teacher id provided and user is teacher with other id fails', async () => {
      await expect(
        classDomain.getClasses(getClassesOtherTeacherQuery, userTeacher),
      ).rejects.toThrow();
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
      ).rejects.toThrow();
    });
    test('teacher does not belong to class fails', async () => {
      await expect(
        classDomain.getClassById(getClassByIdUserDoesntBelongId, userTeacher),
      ).rejects.toThrow();
    });
  });
  describe('createClass', () => {
    beforeEach(() => {});
    test('user is teacher and valid param passes', async () => {
      await expect(classDomain.createClass(createClassParams, userTeacher)).resolves.not.toThrow();
    });
    test('user is student fails', async () => {
      await expect(classDomain.createClass(createClassParams, userStudent)).rejects.toThrow();
    });
    test('invalid param fails', async () => {
      await expect(
        classDomain.createClass(createClassInvalidParams, userTeacher),
      ).rejects.toThrow();
    });
  });
  describe('updateClass', () => {
    beforeEach(() => {
      mockClassPeristence.isTeacherFromClass.mockImplementation((userId, classId) => {
        return existingClasses.some(
          (c) => c.id === classId && c.teachers.some((t) => t.userId === userId),
        );
      });
    });
    test('user is teacher of class and valid params passes', async () => {
      await expect(classDomain.updateClass(updateClassParams, userTeacher)).resolves.not.toThrow();
    });
    test('invalid id param fails', async () => {
      await expect(
        classDomain.updateClass(updateClassInvalidIdParams, userStudent),
      ).rejects.toThrow();
    });
    test('invalid name param fails', async () => {
      await expect(
        classDomain.updateClass(updateClassInvalidNameParams, userTeacher),
      ).rejects.toThrow();
    });
    test('user is not teacher of class fails', async () => {
      await expect(
        classDomain.updateClass(updateClassTeacherDoesntBelongParams, userTeacher),
      ).rejects.toThrow();
    });
    test('user is student fails', async () => {
      await expect(classDomain.updateClass(updateClassParams, userStudent)).rejects.toThrow();
    });
  });
});
