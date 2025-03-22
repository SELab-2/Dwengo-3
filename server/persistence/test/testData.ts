import { ClassRoleEnum, UserEntity } from "../../util/types/user.types";
import { saveUser } from "../auth/users.persistance";
import { PrismaSingleton } from "../prismaSingleton";
import { ClassPersistence } from "../class.persistence";
import { ClassDetail } from "../../util/types/class.types";

export const insertUsers = async (): Promise<UserEntity[]> => {
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
            username: "teacher1",
            email: "teacher1@test.com",
            password: "password",
            surname: "teacher1",
            name: "teacher1",
            role: ClassRoleEnum.TEACHER
        }
    ];
    return Promise.all(users.map((user) => saveUser(user)));
} 

export const insertClasses = async (classPersistence: ClassPersistence): Promise<ClassDetail[]> => {
    const users = await insertUsers();
    const teacher = users.find((user) => user.role == ClassRoleEnum.TEACHER);
    if (!teacher) {
        throw new Error("No teacher found");
    }
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
}

export const deleteAllData = async (): Promise<void> => {
    await PrismaSingleton.instance.user.deleteMany();
    await PrismaSingleton.instance.class.deleteMany();
}