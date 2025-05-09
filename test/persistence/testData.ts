import {
  AuthenticationProvider,
  ClassRoleEnum,
  FullUserType,
  UserEntity,
} from '../../server/util/types/user.types';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';
import { ClassPersistence } from '../../server/persistence/class.persistence';
import { ClassDetail } from '../../server/util/types/class.types';
import { ClassJoinRequestPersistence } from '../../server/persistence/classJoinRequest.persistence';
import { ClassJoinRequestDetail } from '../../server/util/types/classJoinRequest.types';
import {
  ContentTypeEnum,
  LearningObjectCreateParams,
  LearningObjectDetail,
  MultipleChoice,
  SubmissionTypeEnum,
} from '../../server/util/types/learningObject.types';
import { LearningObjectPersistence } from '../../server/persistence/learningObject.persistence';
import { LearningObjectKeywordPersistence } from '../../server/persistence/learningObjectKeyword.persistence';
import { LearningPathPersistence } from '../../server/persistence/learningPath.persistence';
import { LearningPathNodePersistence } from '../../server/persistence/learningPathNode.persistence';
import {
  LearningPathCreateParams,
  LearningPathDetail,
} from '../../server/util/types/learningPath.types';
import { LearningPathNodeDetail } from '../../server/util/types/learningPathNode.types';
import {
  AnnouncementCreatePersistenceParams,
  AnnouncementDetail,
} from '../../server/util/types/announcement.types';
import { AnnouncementPersistence } from '../../server/persistence/announcement.persistence';
import { DiscussionPersistence } from '../../server/persistence/discussion.persistence';
import { DiscussionCreateParams, DiscussionDetail } from '../../server/util/types/discussion.types';
import { AssignmentCreateSchema, AssignmentDetail } from '../../server/util/types/assignment.types';
import { AssignmentPersistence } from '../../server/persistence/assignment.persistence';
import { AssignmentSubmissionDetail } from '../../server/util/types/assignmentSubmission.types';
import { AssignmentSubmissionPersistence } from '../../server/persistence/assignmentSubmission.persistence';
import { StudentPersistence } from '../../server/persistence/student.persistence';
import { TeacherPersistence } from '../../server/persistence/teacher.persistence';
import { MessageCreateParams, MessageDetail } from '../../server/util/types/message.types';
import { MessagePersistence } from '../../server/persistence/message.persistence';
import { UsersPersistence } from '../../server/persistence/auth/users.persistence';
import { CreateUserParams } from '../../server/util/types/auth.types';
import * as crypto from 'node:crypto';

const classPersistence: ClassPersistence = new ClassPersistence();
const classJoinRequestPersistence: ClassJoinRequestPersistence = new ClassJoinRequestPersistence();
const learningObjectPersistence: LearningObjectPersistence = new LearningObjectPersistence();
const learningObjectKeywordPersistence: LearningObjectKeywordPersistence =
  new LearningObjectKeywordPersistence();
const learningPathPersistence: LearningPathPersistence = new LearningPathPersistence();
const learningPathNodePersistence: LearningPathNodePersistence = new LearningPathNodePersistence();
const announcementPersistence: AnnouncementPersistence = new AnnouncementPersistence();
const discussionPersistence: DiscussionPersistence = new DiscussionPersistence();
const assignmentPersistence: AssignmentPersistence = new AssignmentPersistence();
const assignemntSubmissionPersistence: AssignmentSubmissionPersistence =
  new AssignmentSubmissionPersistence();
const studentPersistence: StudentPersistence = new StudentPersistence();
const teacherPersistence: TeacherPersistence = new TeacherPersistence();
const messagePersistence: MessagePersistence = new MessagePersistence();
const usersPersistence: UsersPersistence = new UsersPersistence();

export const insertStudents = async (): Promise<FullUserType[]> => {
  const users: CreateUserParams[] = [
    {
      username: 'student1',
      email: 'student1@test.com',
      password: crypto.createHash('sha256').update('password').digest('base64'),
      surname: 'student1',
      name: 'student1',
      role: ClassRoleEnum.STUDENT,
      provider: AuthenticationProvider.LOCAL,
    },
    {
      username: 'student2',
      email: 'student2@test.com',
      password: crypto.createHash('sha256').update('password').digest('base64'),
      surname: 'student2',
      name: 'student2',
      role: ClassRoleEnum.STUDENT,
      provider: AuthenticationProvider.LOCAL,
    },
  ];
  return Promise.all(users.map((user) => usersPersistence.saveUser(user)));
};

const insertTeachers = async (): Promise<FullUserType[]> => {
  const users: CreateUserParams[] = [
    {
      username: 'teacher1',
      email: 'teacher1@test.com',
      password: crypto.createHash('sha256').update('password').digest('base64'),
      surname: 'teacher1',
      name: 'teacher1',
      role: ClassRoleEnum.TEACHER,
      provider: AuthenticationProvider.LOCAL,
    },
    {
      username: 'teacher2',
      email: 'teacher2@test.com',
      password: crypto.createHash('sha256').update('password').digest('base64'),
      surname: 'teacher2',
      name: 'teacher2',
      role: ClassRoleEnum.TEACHER,
      provider: AuthenticationProvider.LOCAL,
    },
  ];
  return Promise.all(users.map((user) => usersPersistence.saveUser(user)));
};

export const insertUsers = async (): Promise<FullUserType[]> => {
  const [students, teachers] = await Promise.all([insertStudents(), insertTeachers()]);
  return [...students, ...teachers];
};

export const insertClasses = async (): Promise<ClassDetail[]> => {
  const teacher = await usersPersistence.saveUser({
    username: 'teacher3',
    email: 'teacher3@test.com',
    password: crypto.createHash('sha256').update('password').digest('base64'),
    surname: 'teacher3',
    name: 'teacher3',
    role: ClassRoleEnum.TEACHER,
    provider: AuthenticationProvider.LOCAL,
  });
  const classes = [
    {
      name: 'Math',
    },
    {
      name: 'Physics',
    },
    {
      name: 'Biology',
    },
  ];
  return Promise.all(
    classes.map((classData) => classPersistence.createClass(classData, teacher as UserEntity)),
  );
};

export const insertClassJoinRequests = async (): Promise<ClassJoinRequestDetail[]> => {
  const classes = await insertClasses();
  const students = await insertStudents();
  const teachers = await insertTeachers();
  return Promise.all([
    ...classes.flatMap((classData) =>
      students.map((student) =>
        classJoinRequestPersistence.createClassJoinRequest(
          { classId: classData.id },
          student as UserEntity,
        ),
      ),
    ),
    ...classes.flatMap((classData) =>
      teachers.map((teacher) =>
        classJoinRequestPersistence.createClassJoinRequest(
          { classId: classData.id },
          teacher as UserEntity,
        ),
      ),
    ),
  ]);
};

export const insertClassesWithStudents = async (): Promise<ClassDetail[]> => {
  const joinRequests = await insertClassJoinRequests();
  const classIds = new Set<string>();
  for (const joinRequest of joinRequests) {
    await classJoinRequestPersistence.handleJoinRequest({
      requestId: joinRequest.id,
      acceptRequest: true,
    });
    classIds.add(joinRequest.class.id);
  }
  return Promise.all(Array.from(classIds).map((classId) => classPersistence.getClassById(classId)));
};

export const insertLearningObjects = async (): Promise<LearningObjectDetail[]> => {
  const learningObjectsData: LearningObjectCreateParams[] = [
    {
      hruid: 'Text plain object',
      uuid: '1',
      version: 1,
      language: 'EN',
      title: 'test',
      description: 'test',
      contentType: ContentTypeEnum.Enum.TEXT_PLAIN,
      targetAges: [7, 8, 9],
      difficulty: 5,
      estimatedTime: 10,
      content: 'test',
      teacherExclusive: false,
      available: true,
    },
    {
      hruid: 'Object with multiple choice',
      uuid: '2',
      version: 1,
      language: 'EN',
      title: 'test',
      description: 'test',
      contentType: ContentTypeEnum.Enum.TEXT_PLAIN,
      targetAges: [10, 11, 12],
      difficulty: 5,
      estimatedTime: 10,
      content: 'test',
      teacherExclusive: false,
      available: true,
      multipleChoice: { question: 'test', options: ['a', 'b', 'c'] },
      submissionType: SubmissionTypeEnum.Enum.MULTIPLE_CHOICE,
    },
    {
      hruid: 'Object with file submission',
      uuid: '3',
      version: 1,
      language: 'EN',
      title: 'test',
      description: 'test',
      contentType: ContentTypeEnum.Enum.TEXT_PLAIN,
      targetAges: [13, 14, 15],
      difficulty: 5,
      estimatedTime: 10,
      content: 'test',
      teacherExclusive: false,
      available: true,
      submissionType: SubmissionTypeEnum.Enum.FILE,
    },
  ];
  const keywordsData = [
    [{ keyword: 'test1' }, { keyword: 'test2' }, { keyword: 'test3' }],
    [{ keyword: 'test1' }, { keyword: 'test2' }, { keyword: 'test3' }],
    [{ keyword: 'test1' }, { keyword: 'test2' }, { keyword: 'test4' }],
  ];
  const learningObjects: LearningObjectDetail[] = await Promise.all(
    learningObjectsData.map((object) => learningObjectPersistence.createLearningObject(object)),
  );
  for (let i = 0; i < keywordsData.length; i++) {
    const keywords = await learningObjectKeywordPersistence.updateLearningObjectKeywords(
      learningObjects[i].id,
      keywordsData[i],
    );
    learningObjects[i].keywords = keywords.map((keyword) => ({
      keyword: keyword.keyword,
    }));
  }
  return learningObjects;
};

const insertLearningPathsHelp = async (): Promise<LearningPathDetail[]> => {
  const learningPaths: LearningPathCreateParams[] = [
    {
      hruid: 'learning path 1',
      language: 'EN',
      title: 'test',
      description: 'test',
    },
    {
      hruid: 'learning path 2',
      language: 'EN',
      title: 'test2',
      description: 'test',
    },
  ];
  return Promise.all(
    learningPaths.map((learningPath) => learningPathPersistence.createLearningPath(learningPath)),
  );
};

const insertLearningPathNodesHelp = async (
  learningPaths: LearningPathDetail[],
): Promise<LearningPathNodeDetail[]> => {
  const learningObjects = await insertLearningObjects();
  const learningPathNodes: LearningPathNodeDetail[] = [];
  for (const learningPath of learningPaths) {
    const nodes: LearningPathNodeDetail[] = await Promise.all(
      learningObjects.map((learningObject, index) =>
        learningPathNodePersistence.createLearningPathNode(
          {
            learningPathId: learningPath.id,
            learningObjectId: learningObject.id,
          },
          index,
        ),
      ),
    );
    learningPath.learningPathNodes = nodes.map((node) => ({
      id: node.id,
      learningObject: node.learningObject,
    }));
    learningPathNodes.push(...nodes);
  }
  return learningPathNodes;
};

export const insertLearningPaths = async (): Promise<LearningPathDetail[]> => {
  const learningPaths = await insertLearningPathsHelp();
  await insertLearningPathNodesHelp(learningPaths);
  return learningPaths;
};

export const insertLearningPathNodes = async (): Promise<LearningPathNodeDetail[]> => {
  const learningPaths = await insertLearningPathsHelp();
  return insertLearningPathNodesHelp(learningPaths);
};

export const insertAnnouncements = async (): Promise<AnnouncementDetail[]> => {
  const classes = await insertClassesWithStudents();
  const announcements: Promise<AnnouncementDetail>[] = [];
  for (const classData of classes) {
    const announcementsData: AnnouncementCreatePersistenceParams[] = [
      {
        title: 'Announcement 1',
        content: 'test',
        classId: classData.id,
      },
      {
        title: 'Announcemnt 2',
        content: 'test',
        classId: classData.id,
      },
    ];
    announcements.push(
      ...announcementsData.map((announcement) =>
        announcementPersistence.createAnnouncement(announcement, classData.teachers[0].id),
      ),
    );
  }
  return Promise.all(announcements);
};

export const insertAssignments = async (): Promise<AssignmentDetail[]> => {
  const classes = await insertClassesWithStudents();
  const learningPaths = await insertLearningPaths();
  const assignments: Promise<AssignmentDetail>[] = [];
  for (const classData of classes) {
    const groups = classData.students.map((student) => [student.id]);
    for (const path of learningPaths) {
      const assignment = AssignmentCreateSchema.parse({
        name: 'test',
        description: 'testDescription',
        classId: classData.id,
        teacherId: classData.teachers[0].id,
        groups: groups,
        learningPathId: path.id,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        name: "Test",
        description: "Test assignment"
      });
      assignments.push(assignmentPersistence.createAssignment(assignment));
    }
  }
  return Promise.all(assignments);
};

export const insertAssignmentsSubmissions = async (): Promise<AssignmentSubmissionDetail[]> => {
  const assignments = await insertAssignments();
  const submissions: Promise<AssignmentSubmissionDetail>[] = [];
  for (const assignemnt of assignments) {
    for (const group of assignemnt.groups) {
      for (const learningPathNode of assignemnt.learningPath.learningPathNodes) {
        const learningObject = await learningObjectPersistence.getLearningObjectById(
          learningPathNode.learningObject.id,
        );
        if (learningObject.submissionType === SubmissionTypeEnum.Enum.MULTIPLE_CHOICE) {
          const multipleChoice = learningObject.multipleChoice as MultipleChoice;
          submissions.push(
            assignemntSubmissionPersistence.createAssignmentSubmission({
              nodeId: learningPathNode.id,
              groupId: group.id,
              submissionType: SubmissionTypeEnum.Enum.MULTIPLE_CHOICE,
              submission: multipleChoice.options[0],
            }),
          );
        } else if (learningObject.submissionType === SubmissionTypeEnum.Enum.FILE) {
          submissions.push(
            assignemntSubmissionPersistence.createAssignmentSubmission({
              nodeId: learningPathNode.id,
              groupId: group.id,
              submissionType: SubmissionTypeEnum.Enum.FILE,
              submission: {
                fileName: 'test.txt',
                filePath: 'files-submissions/qkjfqmlfqkf.txt',
              },
            }),
          );
        }
      }
    }
  }
  return Promise.all(submissions);
};

export const insertDiscussions = async (): Promise<DiscussionDetail[]> => {
  const assignments = await insertAssignments();
  const discussions: Promise<DiscussionDetail>[] = [];
  for (const assignemnt of assignments) {
    for (const group of assignemnt.groups) {
      const discussionData: DiscussionCreateParams = {
        groupId: group.id,
      };
      // get the group members userIds
      const groupMemberUserIds: string[] = await studentPersistence.getStudentUserIdsByGroupId(
        group.id,
      );

      // get the teacherIds
      const teacherIds: string[] = await teacherPersistence.getTeacherUserIdsByGroupId(group.id);

      const memberIds = groupMemberUserIds.concat(teacherIds);
      discussions.push(discussionPersistence.createDiscussion(discussionData, memberIds));
    }
  }
  return Promise.all(discussions);
};

export const insertMessages = async (): Promise<MessageDetail[]> => {
  const discussions = await insertDiscussions();
  const messages: Promise<MessageDetail>[] = [];
  for (const discussion of discussions) {
    const messagesData: MessageCreateParams[] = [
      {
        content: 'test',
        discussionId: discussion.id,
        senderId: discussion.members[0].id,
      },
      {
        content: 'test2',
        discussionId: discussion.id,
        senderId: discussion.members[0].id,
      },
    ];
    for (const message of messagesData) {
      messages.push(messagePersistence.createMessage(message));
    }
  }
  return Promise.all(messages);
};

export const deleteAllData = async (): Promise<void> => {
  await PrismaSingleton.instance.classJoinRequest.deleteMany();
  await PrismaSingleton.instance.assignmentSubmission.deleteMany();
  await PrismaSingleton.instance.announcement.deleteMany();
  await PrismaSingleton.instance.message.deleteMany();
  await PrismaSingleton.instance.discussion.deleteMany();
  await PrismaSingleton.instance.group.deleteMany();
  await PrismaSingleton.instance.assignment.deleteMany();
  await PrismaSingleton.instance.user.deleteMany();
  await PrismaSingleton.instance.class.deleteMany();
  await PrismaSingleton.instance.learningPathNode.deleteMany();
  await PrismaSingleton.instance.learningPath.deleteMany();
  await PrismaSingleton.instance.learningObject.deleteMany();
};
