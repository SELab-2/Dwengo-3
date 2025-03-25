import { ClassRoleEnum, UserEntity } from '../../util/types/user.types';
import { saveUser } from '../auth/users.persistance';
import { PrismaSingleton } from '../prismaSingleton';
import { ClassPersistence } from '../class.persistence';
import { ClassDetail } from '../../util/types/class.types';
import { ClassJoinRequestPersistence } from '../classJoinRequest.persistence';
import { ClassJoinRequestDetail } from '../../util/types/classJoinRequest.types';
import {
  ContentTypeEnum,
  LearningObjectCreateParams,
  LearningObjectDetail,
  SubmissionTypeEnum,
} from '../../util/types/learningObject.types';
import { LearningObjectPersistence } from '../learningObject.persistence';
import { LearningObjectKeywordPersistence } from '../learningObjectKeyword.persistence';
import { LearningPathPersistence } from '../learningPath.persistence';
import { LearningPathNodePersistence } from '../learningPathNode.persistence';
import {
  LearningPathCreateParams,
  LearningPathDetail,
} from '../../util/types/learningPath.types';
import { LearningPathNodeDetail } from '../../util/types/learningPathNode.types';
import {
  AnnouncementCreatePersistenceParams,
  AnnouncementDetail,
} from '../../util/types/announcement.types';
import { AnnouncementPersistence } from '../announcement.persistence';
import { DiscussionPersistence } from '../discussion.persistence';
import {
  DiscussionCreateParams,
  DiscussionDetail,
} from '../../util/types/discussion.types';

const classPersistence: ClassPersistence = new ClassPersistence();
const classJoinRequestPersistence: ClassJoinRequestPersistence =
  new ClassJoinRequestPersistence();
const learningObjectPersistence: LearningObjectPersistence =
  new LearningObjectPersistence();
const learningObjectKeywordPersistence: LearningObjectKeywordPersistence =
  new LearningObjectKeywordPersistence();
const learningPathPersistence: LearningPathPersistence =
  new LearningPathPersistence();
const learningPathNodePersistence: LearningPathNodePersistence =
  new LearningPathNodePersistence();
const announcementPersistence: AnnouncementPersistence =
  new AnnouncementPersistence();
const discussionPersistence: DiscussionPersistence =
  new DiscussionPersistence();

export const insertStudents = async (): Promise<UserEntity[]> => {
  const users = [
    {
      username: 'student1',
      email: 'student1@test.com',
      password: 'password',
      surname: 'student1',
      name: 'student1',
      role: ClassRoleEnum.STUDENT,
    },
    {
      username: 'student2',
      email: 'student2@test.com',
      password: 'password',
      surname: 'student2',
      name: 'student2',
      role: ClassRoleEnum.STUDENT,
    },
  ];
  return Promise.all(users.map((user) => saveUser(user)));
};

const insertTeachers = async (): Promise<UserEntity[]> => {
  const users = [
    {
      username: 'teacher1',
      email: 'teacher1@test.com',
      password: 'password',
      surname: 'teacher1',
      name: 'teacher1',
      role: ClassRoleEnum.TEACHER,
    },
    {
      username: 'teacher2',
      email: 'teacher2@test.com',
      password: 'password',
      surname: 'teacher2',
      name: 'teacher2',
      role: ClassRoleEnum.TEACHER,
    },
  ];
  return Promise.all(users.map((user) => saveUser(user)));
};

export const insertUsers = async (): Promise<UserEntity[]> => {
  const [students, teachers] = await Promise.all([
    insertStudents(),
    insertTeachers(),
  ]);
  return [...students, ...teachers];
};

export const insertClasses = async (): Promise<ClassDetail[]> => {
  const teacher = await saveUser({
    username: 'teacher3',
    email: 'teacher3@test.com',
    password: 'password',
    surname: 'teacher3',
    name: 'teacher3',
    role: ClassRoleEnum.TEACHER,
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
    classes.map((classData) =>
      classPersistence.createClass(classData, teacher),
    ),
  );
};

export const insertClassJoinRequests = async (): Promise<
  ClassJoinRequestDetail[]
> => {
  const classes = await insertClasses();
  const students = await insertStudents();
  const teachers = await insertTeachers();
  return Promise.all([
    ...classes.flatMap((classData) =>
      students.map((student) =>
        classJoinRequestPersistence.createClassJoinRequest(
          { classId: classData.id },
          student,
        ),
      ),
    ),
    ...classes.flatMap((classData) =>
      teachers.map((teacher) =>
        classJoinRequestPersistence.createClassJoinRequest(
          { classId: classData.id },
          teacher,
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
  return Promise.all(
    Array.from(classIds).map((classId) =>
      classPersistence.getClassById(classId),
    ),
  );
};

export const insertLearningObjects = async (): Promise<
  LearningObjectDetail[]
> => {
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
    learningObjectsData.map((object) =>
      learningObjectPersistence.createLearningObject(object),
    ),
  );
  for (let i = 0; i < keywordsData.length; i++) {
    const keywords =
      await learningObjectKeywordPersistence.updateLearningObjectKeywords(
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
      title: 'test',
      description: 'test',
    },
  ];
  return Promise.all(
    learningPaths.map((learningPath) =>
      learningPathPersistence.createLearningPath(learningPath),
    ),
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

export const insertLearningPathNodes = async (): Promise<
  LearningPathNodeDetail[]
> => {
  const learningPaths = await insertLearningPathsHelp();
  return insertLearningPathNodesHelp(learningPaths);
};

export const insertAnnouncements = async (): Promise<AnnouncementDetail[]> => {
  const classes = await insertClassesWithStudents();
  const announcements = [];
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
        announcementPersistence.createAnnouncement(
          announcement,
          classData.teachers[0].id,
        ),
      ),
    );
  }
  return Promise.all(announcements);
};

// TODO: Vooraleer we deze Discussion test maken zouden we eigenlijk
// de createParams van de discussion moeten aanpassen
// Momenteel moet je zelf members meegeven terwijl deze beter in de backend worden opgehaald

// export const insertDiscussions = async (): Promise<DiscussionDetail[]> => {
//     const classes = await insertClassesWithStudents();
//     const discussions = [];
//     for (const classData of classes) {
//         const discussionData: DiscussionCreateParams = {
//             title: "Discussion 1",
//             content: "test",
//             classId: classData.id
//         };
//         discussions.push(discussionPersistence.createDiscussion(discussionData, classData.teachers[0].id));
//     }

export const deleteAllData = async (): Promise<void> => {
  await PrismaSingleton.instance.classJoinRequest.deleteMany();
  await PrismaSingleton.instance.announcement.deleteMany();
  await PrismaSingleton.instance.user.deleteMany();
  await PrismaSingleton.instance.class.deleteMany();
  await PrismaSingleton.instance.learningPathNode.deleteMany();
  await PrismaSingleton.instance.learningPath.deleteMany();
  await PrismaSingleton.instance.learningObject.deleteMany();
};
