import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DiscussionDomain } from '../../../server/domain/discussion.domain';
import { ClassRoleEnum, UserEntity } from '../../../server/util/types/user.types';
import { testDiscussions, testPaginationFilter, testTeachers, testStudents, testUsers, testGroups, testAssignments, testLearningPaths } from '../../testObjects.json';

// discussion persistence mock
const { mockDiscussionPeristence, mockGroupPersistence } = vi.hoisted(() => {
    return {
        mockDiscussionPeristence: {
            getDiscussions: vi.fn(),
            getDiscussionById: vi.fn(),
            createDiscussion: vi.fn(),
        },
        mockGroupPersistence: {
            getGroupById: vi.fn(),
            getGroupByIdWithCustomIncludes: vi.fn(),
        },
    };
});
vi.mock('../../../server/persistence/discussion.persistence', () => ({
    DiscussionPersistence: vi.fn().mockImplementation(() => {
        return mockDiscussionPeristence;
    })
}));
vi.mock('../../../server/persistence/group.persistence', () => ({
    GroupPersistence: vi.fn().mockImplementation(() => {
        return mockGroupPersistence;
    })
}));

const discussionDomain = new DiscussionDomain();
let userTeacher: UserEntity = { 
    ...testUsers[0], 
    role: testUsers[0].role as ClassRoleEnum,
    teacher: testTeachers[0]
};
let userTeacherOtherGroup: UserEntity = { 
    ...testUsers[1], 
    role: testUsers[1].role as ClassRoleEnum ,
    teacher: testTeachers[1]
};
let userStudent: UserEntity = { 
    ...testUsers[5], 
    role: testUsers[5].role as ClassRoleEnum, 
    student: testStudents[0]
};

let getDiscussionsQuery = {
    ...testPaginationFilter,
    groupIds: [testDiscussions[0].groupId],
};
let getDiscussionsInvalidPaginationQuery = {
    ...getDiscussionsQuery,
    page: '-1',
};
let getDiscussionsEmptyQuery = {
    ...testPaginationFilter,
};
let getDiscussionsInvalidGroupIdQuery = {
    ...getDiscussionsQuery,
    groupIds: ['id'],
};

let getDiscussionByIdId = testDiscussions[0].id;

let createDiscussionParams = testDiscussions[0];
let createDiscussionInvalidGroupIdParams = {
    ...createDiscussionParams,
    groupId: 'id',
};
let createDiscussionInvalidMembersParams = {
    ...createDiscussionParams,
    members: ['id'],
};
let createDiscussionMemberNotInGroupParams = {
    ...createDiscussionParams,
    members: [testStudents[2].userId],
};

// Tests
describe('discussion domain', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      mockGroupPersistence.getGroupByIdWithCustomIncludes.mockImplementation((id: string) => {
        let found = testGroups.find(g => g.id === id)
            if (found) {
                return found;
            }
        return null;
      });
      mockDiscussionPeristence.getDiscussions.mockImplementation((filter, pag) => {
        return {};
      });
      mockDiscussionPeristence.getDiscussionById.mockImplementation((id) => {
        let found = testDiscussions.find(d => d.id === id)
            if (found) {
                return found;
            }
        return null;
      });
    });
    describe('getDiscussions', () => {
      test('valid query passes', async () => {
        await expect(discussionDomain.getDiscussions(getDiscussionsQuery, userTeacher)).resolves.not.toThrow()
      });
      test('user does not belong to a group fails', async () => {
        await expect(discussionDomain.getDiscussions(getDiscussionsQuery, userTeacherOtherGroup)).rejects.toThrow()
      });
      test('invalid pagination fails', async () => {
        await expect(discussionDomain.getDiscussions(getDiscussionsInvalidPaginationQuery, userTeacher)).rejects.toThrow()
      });
      test('empty query fails', async () => {
        await expect(discussionDomain.getDiscussions(getDiscussionsEmptyQuery, userTeacher)).rejects.toThrow()
      });
      test('invalid group id fails', async () => {
        await expect(discussionDomain.getDiscussions(getDiscussionsInvalidGroupIdQuery, userTeacher)).rejects.toThrow()
      });
    });
    describe('getDiscussionById', () => {
        test('user belongs to group passes', async () => {
          await expect(discussionDomain.getDiscussionById(getDiscussionByIdId, userTeacher)).resolves.not.toThrow()
        });
        test('user does not belong to group fails', async () => {
            await expect(discussionDomain.getDiscussionById(getDiscussionByIdId, userTeacherOtherGroup)).rejects.toThrow()
        });
      });
    describe('createDiscussion', () => {
      test('valid params and user belongs to group passes', async () => {
        await expect(discussionDomain.createDiscussion(createDiscussionParams, userTeacher)).resolves.not.toThrow()
      });
      test('user does not belong to group fails', async () => {
        await expect(discussionDomain.createDiscussion(createDiscussionParams, userTeacherOtherGroup)).rejects.toThrow()
      });
      test('invalid group id fails', async () => {
        await expect(discussionDomain.createDiscussion(createDiscussionInvalidGroupIdParams, userTeacher)).rejects.toThrow()
      });
      test('invalid user id in members fails', async () => {
        await expect(discussionDomain.createDiscussion(createDiscussionInvalidMembersParams, userTeacher)).rejects.toThrow()
      });
      test('a member does not belong to group fails', async () => {
        await expect(discussionDomain.createDiscussion(createDiscussionMemberNotInGroupParams, userTeacher)).rejects.toThrow()
      });
    });
  });
