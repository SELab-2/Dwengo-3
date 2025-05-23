import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AssignmentDomain } from '../../server/domain/assignment.domain';
import { UserEntity } from '../../server/util/types/user.types';
import {
  testAssignments,
  testClasses,
  testGroups,
  testLearningPaths,
  testPaginationFilter,
  testStudents,
  testTeachers,
  testUsers,
} from '../testObjects.json';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';

// assignment persistence mock
const { mockAssignmentPeristence, mockClassPeristence, mockGroupPeristence } = vi.hoisted(() => {
  return {
    mockAssignmentPeristence: {
      getAssignments: vi.fn(),
      getAssignmentId: vi.fn(),
      createAssignment: vi.fn(),
    },
    mockClassPeristence: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
    },
    mockGroupPeristence: {
      getGroupById: vi.fn(),
      getGroupByIdWithCustomIncludes: vi.fn(),
      createGroups: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/assignment.persistence', () => ({
  AssignmentPersistence: vi.fn().mockImplementation(() => {
    return mockAssignmentPeristence;
  }),
}));
vi.mock('../../server/persistence/class.persistence', () => ({
  ClassPersistence: vi.fn().mockImplementation(() => {
    return mockClassPeristence;
  }),
}));
vi.mock('../../server/persistence/group.persistence', () => ({
  GroupPersistence: vi.fn().mockImplementation(() => {
    return mockGroupPeristence;
  }),
}));

const assignmentDomain = new AssignmentDomain();

let userTeacher: UserEntity = {
  ...testUsers[0],
  role: testUsers[0].role as ClassRoleEnum,
  teacher: testTeachers[0],
  provider: AuthenticationProvider.LOCAL,
};
let userTeacherNotFirstClass: UserEntity = {
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

let getAssignmentsStudentQuery = {
  ...testPaginationFilter,
  classId: testClasses[0].id,
  groupId: testGroups[0].id,
  studentId: testStudents[0].id,
};
let getAssignmentsTeacherQuery = {
  ...testPaginationFilter,
  classId: testClasses[0].id,
  groupId: testGroups[0].id,
  teacherId: testTeachers[0].id,
};
let getAssignmentsEmptyQuery = {
  ...testPaginationFilter,
};
let getAssignmentsInvalidClassIdQuery = {
  ...testPaginationFilter,
  classId: 'id',
};
let getAssignmentsInvalidGroupIdQuery = {
  ...testPaginationFilter,
  groupId: 'id',
};
let getAssignmentsInvalidTeacherIdQuery = {
  ...testPaginationFilter,
  teacherId: 'id',
};
let getAssignmentsInvalidStudentIdQuery = {
  ...testPaginationFilter,
  studentId: 'id',
};
let getAssignmentsInvalidPaginationQuery = {
  ...testPaginationFilter,
  page: '-1',
  classId: testClasses[0].id,
};

let getAssignmentByIdId = { id: testAssignments[0].id };
let getAssignmentByIdOtherId = { id: testAssignments[1].id };
let getAssignmentByIdInvalidId = { id: 'id' };
let existingClasses = testClasses;
let existingGroups = testGroups;
let existingAssignments = testAssignments;

let createAssigmentParams = {
  groups: [[testStudents[0].id, testStudents[1].id]],
  name: 'test',
  description: 'testDescription',
  deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  classId: testClasses[0].id,
  teacherId: testTeachers[0].id,
  learningPathId: testLearningPaths[0].id,
};
let createAssigmentInvalidGroupType1Params = {
  ...createAssigmentParams,
  groups: testUsers[0].id,
};
let createAssigmentInvalidGroupType2Params = {
  ...createAssigmentParams,
  groups: [testUsers[0].id],
};
let createAssigmentInvalidGroupIdParams = {
  ...createAssigmentParams,
  groups: [['id']],
};
let createAssigmentEmptyGroupParams = {
  ...createAssigmentParams,
  groups: [[]],
};
let createAssigmentInvalidClassIdParams = {
  ...createAssigmentParams,
  classId: 'id',
};
let createAssigmentInvalidTeacherIdParams = {
  ...createAssigmentParams,
  teacherId: 'id',
};
let createAssigmentUnexistingClassParams = {
  ...createAssigmentParams,
  classId: '414d1886-383a-4c1a-aba5-86af803197bd',
};
let createAssigmentStudentNotInClassParams = {
  ...createAssigmentParams,
  groups: [['4c07803c-5555-6666-7777-888899990000']],
};

describe('assignment domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGroupPeristence.getGroupByIdWithCustomIncludes.mockImplementation((id: string) => {
      let found = existingGroups.find((g) => g.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockClassPeristence.getClassById.mockImplementation((id: string) => {
      let found = existingClasses.find((c) => c.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockAssignmentPeristence.getAssignments.mockImplementation((filter, pagination) => {
      return {
        data: [
          {
            groups: [
              {
                students: [
                  {
                    id: userStudent.id,
                  },
                ],
              },
            ],
          },
        ],
        total_pages: 1,
      };
    });
    mockAssignmentPeristence.getAssignmentId.mockImplementation((id: string) => {
      let found = existingAssignments.find((a) => a.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockAssignmentPeristence.createAssignment.mockImplementation((data) => {
      return { ...data };
    });
  });
  describe('getAssignments', () => {
    test('valid query params and user student belongs to group passes', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsStudentQuery, userStudent),
      ).resolves.not.toThrow();
    });
    test('valid query params and user teacher belongs to class passes', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsTeacherQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('empty query fails', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsEmptyQuery, userStudent),
      ).rejects.toThrow();
    });
    test('invalid class id fails', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsInvalidClassIdQuery, userStudent),
      ).rejects.toThrow();
    });
    test('invalid group id fails', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsInvalidGroupIdQuery, userStudent),
      ).rejects.toThrow();
    });
    test('invalid student id fails', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsInvalidStudentIdQuery, userStudent),
      ).rejects.toThrow();
    });
    test('invalid teacher id fails', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsInvalidTeacherIdQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid pagination param fails', async () => {
      await expect(
        assignmentDomain.getAssignments(getAssignmentsInvalidPaginationQuery, userStudent),
      ).rejects.toThrow();
    });
  });
  describe('getAssignmentById', () => {
    test('valid id student belongs to class passes', async () => {
      await expect(
        assignmentDomain.getAssignmentById(getAssignmentByIdId.id, userStudent),
      ).resolves.not.toThrow();
    });
    test('valid id teacher belongs to class passes', async () => {
      await expect(
        assignmentDomain.getAssignmentById(getAssignmentByIdId.id, userTeacher),
      ).resolves.not.toThrow();
    });
    test('student does not belong to class fails', async () => {
      await expect(
        assignmentDomain.getAssignmentById(getAssignmentByIdOtherId.id, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40002 });
    });
    test('teacher does not belong to class fails', async () => {
      await expect(
        assignmentDomain.getAssignmentById(getAssignmentByIdOtherId.id, userTeacher),
      ).rejects.toMatchObject({ _errorCode: 40001 });
    });
    test('valid query params and user teacher belongs to class passes', async () => {
      await expect(
        assignmentDomain.getAssignmentById(getAssignmentByIdInvalidId.id, userStudent),
      ).rejects.toThrow();
    });
  });
  describe('createAssignment', () => {
    test('valid params and teacher belongs to class passes', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentParams, userTeacher),
      ).resolves.not.toThrow();
    });
    test('teacher does not belong to class fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentParams, userTeacherNotFirstClass),
      ).rejects.toMatchObject({ _errorCode: 40001 });
    });
    test('user is student fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentParams, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40012 });
    });
    test('groups is invalid type fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentInvalidGroupType1Params, userTeacher),
      ).rejects.toThrow();
    });
    test('groups is not a 2d array fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentInvalidGroupType2Params, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid id in groups fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentInvalidGroupIdParams, userTeacher),
      ).rejects.toThrow();
    });
    test('empty groups fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentEmptyGroupParams, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid class id fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentInvalidClassIdParams, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid teacher id fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentInvalidTeacherIdParams, userTeacher),
      ).rejects.toThrow();
    });
    test('unexisting class fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentUnexistingClassParams, userTeacher),
      ).rejects.toMatchObject({ _errorCode: 40401 });
    });
    test('student in groups does not belong to class fails', async () => {
      await expect(
        assignmentDomain.createAssignment(createAssigmentStudentNotInClassParams, userTeacher),
      ).rejects.toMatchObject({ _errorCode: 40040 });
    });
  });
});
