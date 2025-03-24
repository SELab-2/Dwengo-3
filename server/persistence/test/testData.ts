import { ClassRoleEnum, UserEntity } from "../../util/types/user.types";
import { saveUser } from "../auth/users.persistance";
import { PrismaSingleton } from "../prismaSingleton";
import { ClassPersistence } from "../class.persistence";
import { ClassDetail } from "../../util/types/class.types";
import { ClassJoinRequestPersistence } from "../classJoinRequest.persistence";
import { ClassJoinRequestDetail } from "../../util/types/classJoinRequest.types";
import { ContentTypeEnum, LearningObjectCreateParams, LearningObjectDetail, SubmissionTypeEnum } from "../../util/types/learningObject.types";
import { LearningObjectPersistence } from "../learningObject.persistence";
import { LearningObjectKeywordPersistence } from "../learningObjectKeyword.persistence";
import { LearningPathPersistence } from "../learningPath.persistence";
import { LearningPathNodePersistence } from "../learningPathNode.persistence";
import { LearningPathCreateParams, LearningPathDetail } from "../../util/types/learningPath.types";
import { LearningPathNodeDetail } from "../../util/types/learningPathNode.types";

const classPersistence: ClassPersistence = new ClassPersistence();
const classJoinRequestPersistence: ClassJoinRequestPersistence = new ClassJoinRequestPersistence();
const learningObjectPersistence: LearningObjectPersistence = new LearningObjectPersistence();
const learningObjectKeywordPersistence: LearningObjectKeywordPersistence = new LearningObjectKeywordPersistence();
const learningPathPersistence: LearningPathPersistence = new LearningPathPersistence();
const learningPathNodePersistence: LearningPathNodePersistence = new LearningPathNodePersistence();

const insertStudents = async (): Promise<UserEntity[]> => {
    const users = [
        {
            username: "student1",
            email: "student1@test.com",
            password: "password",
            surname: "student1",
            name: "student1",
            role: ClassRoleEnum.STUDENT
        },
        {
            username: "student2",
            email: "student2@test.com",
            password: "password",
            surname: "student2",
            name: "student2",
            role: ClassRoleEnum.STUDENT
        }
    ];
    return Promise.all(users.map((user) => saveUser(user)));
};

const insertTeachers = async (): Promise<UserEntity[]> => {
    const users = [
        {
            username: "teacher1",
            email: "teacher1@test.com",
            password: "password",
            surname: "teacher1",
            name: "teacher1",
            role: ClassRoleEnum.TEACHER
        },
        {
            username: "teacher2",
            email: "teacher2@test.com",
            password: "password",
            surname: "teacher2",
            name: "teacher2",
            role: ClassRoleEnum.TEACHER
        }
    ];
    return Promise.all(users.map((user) => saveUser(user)));
};

export const insertUsers = async (): Promise<UserEntity[]> => {
    const [students, teachers] = await Promise.all([insertStudents(), insertTeachers()]);
    return [...students, ...teachers];
};

export const insertClasses = async (): Promise<ClassDetail[]> => {
    const teacher = (await insertTeachers())[0];
    const classes = [
        { 
            name: "Math",
        },
        {
            name: "Physics"
        },
        {
            name: "Biology"
        }
    ];
    return Promise.all(classes.map((classData) => classPersistence.createClass(classData, teacher)));
};

export const insertClassJoinResuests = async (): Promise<ClassJoinRequestDetail[]> => {
    const classData = (await insertClasses())[0];
    const students = await insertStudents();
    return Promise.all(students.map((student) => classJoinRequestPersistence.createClassJoinRequest({classId: classData.id}, student)));
};

export const insertLearningObjects = async (): Promise<LearningObjectDetail[]> => {
    const learningObjectsData: LearningObjectCreateParams[] = [
        {
            hruid: "Text plain object",
            uuid: "1",
            version: 1,
            language: "EN",
            title: "test",
            description: "test",
            contentType: ContentTypeEnum.Enum.TEXT_PLAIN,
            targetAges: [7, 8, 9],
            difficulty: 5,
            estimatedTime: 10,
            content: "test",
            teacherExclusive: false,
            available: true
        },
        {
            hruid: "Object with multiple choice",
            uuid: "2",
            version: 1,
            language: "EN",
            title: "test",
            description: "test",
            contentType: ContentTypeEnum.Enum.TEXT_PLAIN,
            targetAges: [10, 11, 12],
            difficulty: 5,
            estimatedTime: 10,
            content: "test",
            teacherExclusive: false,
            available: true,
            multipleChoice: {question: "test", options: ["a", "b", "c"]},
            submissionType: SubmissionTypeEnum.Enum.MULTIPLE_CHOICE,
        },
        {
            hruid: "Object with file submission",
            uuid: "3",
            version: 1,
            language: "EN",
            title: "test",
            description: "test",
            contentType: ContentTypeEnum.Enum.TEXT_PLAIN,
            targetAges: [13, 14, 15],
            difficulty: 5,
            estimatedTime: 10,
            content: "test",
            teacherExclusive: false,
            available: true,
            submissionType: SubmissionTypeEnum.Enum.FILE,
        },
    ];
    const keywordsData = [
        [{keyword: "test1"}, {keyword: "test2"}, {keyword: "test3"}],
        [{keyword: "test1"}, {keyword: "test2"}, {keyword: "test3"}],
        [{keyword: "test1"}, {keyword: "test2"}, {keyword: "test4"}]
    ];
    const learningObjects: LearningObjectDetail[] = await Promise.all(learningObjectsData.map((object) => learningObjectPersistence.createLearningObject(object)));
    for (let i=0; i<keywordsData.length; i++) {
        const keywords = await learningObjectKeywordPersistence.updateLearningObjectKeywords(learningObjects[i].id, keywordsData[i]);
        learningObjects[i].keywords = keywords.map((keyword) => ({keyword: keyword.keyword}));
    }
    return learningObjects;
};

const insertLearningPathsHelp = async (): Promise<LearningPathDetail[]> => {
    const learningPaths: LearningPathCreateParams[] = [
        {
            hruid: "learning path 1",
            language: "EN",
            title: "test",
            description: "test"
        },
        {
            hruid: "learning path 2",
            language: "EN",
            title: "test",
            description: "test"
        }
    ];
    return Promise.all(learningPaths.map((learningPath) => learningPathPersistence.createLearningPath(learningPath)));
};

const insertLearningPathNodesHelp = async (learningPaths: LearningPathDetail[]): Promise<LearningPathNodeDetail[]> => {
    const learningObjects = await insertLearningObjects();
    const learningPathNodes: LearningPathNodeDetail[] = [];
    for (const learningPath of learningPaths) {
        const nodes: LearningPathNodeDetail[] = await Promise.all(learningObjects.map((learningObject, index) =>
            learningPathNodePersistence.createLearningPathNode(
                {
                    learningPathId: learningPath.id,
                    learningObjectId: learningObject.id
                },
                index
            )
        ));
        learningPath.learningPathNodes = nodes.map((node) => ({id: node.id, learningObject: node.learningObject}));
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

export const deleteAllData = async (): Promise<void> => {
    await PrismaSingleton.instance.classJoinRequest.deleteMany();
    await PrismaSingleton.instance.user.deleteMany();
    await PrismaSingleton.instance.class.deleteMany();
    await PrismaSingleton.instance.learningPathNode.deleteMany();
    await PrismaSingleton.instance.learningPath.deleteMany();
    await PrismaSingleton.instance.learningObject.deleteMany();
};