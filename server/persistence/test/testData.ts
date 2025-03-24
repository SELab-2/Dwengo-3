import { ClassRoleEnum, UserEntity } from "../../util/types/user.types";
import { saveUser } from "../auth/users.persistance";
import { PrismaSingleton } from "../prismaSingleton";
import { ClassPersistence } from "../class.persistence";
import { ClassDetail } from "../../util/types/class.types";
import { ClassJoinRequestPersistence } from "../classJoinRequest.persistence";
import { ClassJoinRequestDetail } from "../../util/types/classJoinRequest.types";

const classPersistence: ClassPersistence = new ClassPersistence();
const classJoinRequestPersistence: ClassJoinRequestPersistence = new ClassJoinRequestPersistence();

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
}

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
}

export const insertUsers = async (): Promise<UserEntity[]> => {
    const [students, teachers] = await Promise.all([insertStudents(), insertTeachers()]);
    return [...students, ...teachers];
}

export const insertClasses = async (): Promise<ClassDetail[]> => {
    const teachers = await insertTeachers();
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
    return Promise.all(classes.map((classData) => classPersistence.createClass(classData, teachers[0])));
}

export const insertClassJoinResuests = async (): Promise<ClassJoinRequestDetail[]> => {
    const classData = (await insertClasses())[0];
    const students = await insertStudents();
    return Promise.all(students.map((student) => classJoinRequestPersistence.createClassJoinRequest({classId: classData.id}, student)));
}

export const deleteAllData = async (): Promise<void> => {
    await PrismaSingleton.instance.classJoinRequest.deleteMany();
    await PrismaSingleton.instance.user.deleteMany();
    await PrismaSingleton.instance.class.deleteMany();
}