import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AnnouncementDomain } from '../../server/domain/announcement.domain';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  UserEntity,
} from '../../server/util/types/user.types';
import {
  testUsers,
  testTeachers,
  testStudents,
  testPaginationFilter,
  testClasses,
  testAnnnouncements,
} from '../testObjects.json';

// announcement persistence mock
const { mockAnnouncementPeristence, mockClassPeristence } = vi.hoisted(() => {
  return {
    mockAnnouncementPeristence: {
      getAnnouncements: vi.fn(),
      createAnnouncement: vi.fn(),
      updateAnnouncement: vi.fn(),
      getAnnouncementById: vi.fn(),
      checkAnnouncementIsFromTeacher: vi.fn(),
    },
    mockClassPeristence: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/announcement.persistence', () => ({
  AnnouncementPersistence: vi.fn().mockImplementation(() => {
    return mockAnnouncementPeristence;
  }),
}));
vi.mock('../../server/persistence/class.persistence', () => ({
  ClassPersistence: vi.fn().mockImplementation(() => {
    return mockClassPeristence;
  }),
}));

const announcementDomain = new AnnouncementDomain();

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

let existingClasses = testClasses;

let getAnnouncementsStudentQuery = {
  ...testPaginationFilter,
  classId: testClasses[0].id,
  studentId: testStudents[0].id,
};
let getAnnouncementsTeacherQuery = {
  ...testPaginationFilter,
  classId: testClasses[0].id,
  teacherId: testTeachers[0].id,
};
let getAnnouncementsInvalidPaginationQuery = {
  ...getAnnouncementsTeacherQuery,
  page: '-1',
};
let getAnnouncementsEmptyQuery = {};
let getAnnouncementsInvalidClassIdQuery = {
  ...getAnnouncementsTeacherQuery,
  classId: 'id',
};
let getAnnouncementsInvalidTeacherIdQuery = {
  ...getAnnouncementsTeacherQuery,
  teacherId: 'id',
};
let getAnnouncementsInvalidStudentIdQuery = {
  ...getAnnouncementsStudentQuery,
  studentId: 'id',
};
let getAnnouncementsNotOfClassQuery = {
  ...getAnnouncementsTeacherQuery,
  classId: testClasses[1].id,
};
let getAnnouncementsStudentNotUserQuery = {
  ...getAnnouncementsStudentQuery,
  studentId: testStudents[1].id,
};
let getAnnouncementsTeacherNotUserQuery = {
  ...getAnnouncementsTeacherQuery,
  teacherId: testTeachers[1].id,
};

let getAnnouncementByIdId = testAnnnouncements[0].id;
let getAnnouncementByIdInvalidId = 'id';
let getAnnouncementByIdNotOfClassId = testAnnnouncements[1].id;

let createAnnouncementParams = {
  title: 'title0',
  content: 'content',
  classId: testClasses[0].id,
};
let createAnnouncementEmptyTitleParams = {
  ...createAnnouncementParams,
  title: '',
};
let createAnnouncementEmptyContentParams = {
  ...createAnnouncementParams,
  content: '',
};
let createAnnouncementInvalidClassIdParams = {
  ...createAnnouncementParams,
  classId: 'id',
};
let createAnnouncementNotOfClassParams = {
  ...createAnnouncementParams,
  classId: testClasses[1].id,
};

let updateAnnouncementId = testAnnnouncements[0].id;
let updateAnnouncementParams = {
  title: 'title0',
  content: 'content',
  classId: testClasses[0].id,
};
let updateAnnouncementEmptyTitleParams = {
  ...createAnnouncementParams,
  title: '',
};
let updateAnnouncementEmptyContentParams = {
  ...createAnnouncementParams,
  content: '',
};
let updateAnnouncementNotOfClassParams = {
  ...createAnnouncementParams,
  classId: testClasses[1].id,
};

describe('announcement domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockClassPeristence.getClassById.mockImplementation((id: string) => {
      let found = existingClasses.find((c) => c.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockAnnouncementPeristence.getAnnouncementById.mockImplementation((id: string) => {
      let found = testAnnnouncements.find((a) => a.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockAnnouncementPeristence.getAnnouncements.mockImplementation((filter, pagination) => {
      return testAnnnouncements[0];
    });
    mockAnnouncementPeristence.createAnnouncement.mockImplementation((data, pagination) => {
      return createAnnouncementParams;
    });
    mockAnnouncementPeristence.updateAnnouncement.mockImplementation((id, data) => {
      return updateAnnouncementParams;
    });
  });
  describe('getAnnouncements', () => {
    test('valid student query passes', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsStudentQuery, userStudent),
      ).resolves.not.toThrow();
    });
    test('valid teacher query passes', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsTeacherQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('invalid pagination fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsInvalidPaginationQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('empty query fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsEmptyQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid class id fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsInvalidClassIdQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid teacher id fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsInvalidTeacherIdQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid student id fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsInvalidStudentIdQuery, userStudent),
      ).rejects.toThrow();
    });
    test('user does not belong to class fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsNotOfClassQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('student id is not user fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsStudentNotUserQuery, userStudent),
      ).rejects.toThrow();
    });
    test('teacher id is not user fails', async () => {
      await expect(
        announcementDomain.getAnnouncements(getAnnouncementsTeacherNotUserQuery, userTeacher),
      ).rejects.toThrow();
    });
  });
  describe('getAnnouncementById', () => {
    test('valid id passes', async () => {
      await expect(
        announcementDomain.getAnnouncementById(getAnnouncementByIdId, userTeacher),
      ).resolves.not.toThrow();
    });
    test('invalid id fails', async () => {
      await expect(
        announcementDomain.getAnnouncementById(getAnnouncementByIdInvalidId, userTeacher),
      ).rejects.toThrow();
    });
    test('user does not belong to class fails', async () => {
      await expect(
        announcementDomain.getAnnouncementById(getAnnouncementByIdNotOfClassId, userTeacher),
      ).rejects.toThrow();
    });
  });
  describe('createAnnouncement', () => {
    test('valid params passes', async () => {
      await expect(
        announcementDomain.createAnnouncement(createAnnouncementParams, userTeacher),
      ).resolves.not.toThrow();
    });
    test('empty title fails', async () => {
      await expect(
        announcementDomain.createAnnouncement(createAnnouncementEmptyTitleParams, userTeacher),
      ).rejects.toThrow();
    });
    test('empty content fails', async () => {
      await expect(
        announcementDomain.createAnnouncement(createAnnouncementEmptyContentParams, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid class id fails', async () => {
      await expect(
        announcementDomain.createAnnouncement(createAnnouncementInvalidClassIdParams, userTeacher),
      ).rejects.toThrow();
    });
    test('user is not teacher fails', async () => {
      await expect(
        announcementDomain.createAnnouncement(createAnnouncementParams, userStudent),
      ).rejects.toThrow();
    });
    test('user does not belong to class fails', async () => {
      await expect(
        announcementDomain.createAnnouncement(createAnnouncementNotOfClassParams, userTeacher),
      ).rejects.toThrow();
    });
  });
  describe('updateAnnouncement', () => {
    test('valid params passes', async () => {
      await expect(
        announcementDomain.updateAnnouncement(
          updateAnnouncementId,
          updateAnnouncementParams,
          userTeacher,
        ),
      ).resolves.not.toThrow();
    });
    test('empty title fails', async () => {
      await expect(
        announcementDomain.updateAnnouncement(
          updateAnnouncementId,
          updateAnnouncementEmptyTitleParams,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
    test('empty content fails', async () => {
      await expect(
        announcementDomain.updateAnnouncement(
          updateAnnouncementId,
          updateAnnouncementEmptyContentParams,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
    test('user is not teacher fails', async () => {
      await expect(
        announcementDomain.updateAnnouncement(
          updateAnnouncementId,
          updateAnnouncementParams,
          userStudent,
        ),
      ).rejects.toThrow();
    });
    /* TODO announcement from teacher throws error in persistence, shoulde be domain */
  });
});
