import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { deleteAllData, insertClassesWithStudents } from "./testData";
import { PrismaSingleton } from "../prismaSingleton";
import { UserEntity } from "../../util/types/user.types";
import { StudentPersistence } from "../student.persistence";
import { getUserById } from "../auth/users.persistance";
import { ClassShort } from "../../util/types/class.types";

const students: UserEntity[] = [];
const classes: ClassShort[] = [];
const studentPersistence: StudentPersistence = new StudentPersistence();

describe("student persistence test", () => {
    beforeAll(async () => {
        const classesDetail = await insertClassesWithStudents();
        const studentPromises = [];
    
        for (const classData of classesDetail) {
            for (const student of classData.students) {
                studentPromises.push(getUserById(student.userId));
            }
            classes.push({name: classData.name, id: classData.id});
        }
    
        students.push(...(await Promise.all(studentPromises)));
    });

    afterAll(async () => {
        await deleteAllData();
        await PrismaSingleton.instance.$disconnect();
    });

    describe("test get student by id", () => {
        test("request with existing id responds correctly", async () => {
            for (const student of students) {
                const req = studentPersistence.getStudentById(student.student!.id);
                const expectedStudent = {
                    id: student.student!.id,
                    userId: student.id,
                    user: {
                        name: student.name,
                        surname: student.surname
                    },
                    classes: expect.arrayContaining(classes),
                    groups: []
                };
                await expect(req).resolves.toStrictEqual(expectedStudent);
            }
        });

        test("request with unexisting id responds with an error", async () => {
            const req = studentPersistence.getStudentById("dqksdjfqj");
            await expect(req).rejects.toThrow();
        });
    });

    describe("test get student by userId", () => {
        test("request with existing userId responds correctly", async () => {
            for (const student of students) {
                const req = studentPersistence.getStudentByUserId(student.id);
                const expectedStudent = {
                    id: student.student!.id,
                    userId: student.id,
                    user: {
                        name: student.name,
                        surname: student.surname
                    },
                    classes: expect.arrayContaining(classes),
                    groups: []
                };
                await expect(req).resolves.toStrictEqual(expectedStudent);
            }
        });

        test("request with unexisting userId responds with an error", async () => {
            const req = studentPersistence.getStudentByUserId("dqksdjfqj");
            await expect(req).rejects.toThrow();
        });
    });

    describe("test get students", () => {
        test("request all students with classId", async () => {
            const expectedStudents = students.map((student) => ({
                id: student.student!.id,
                userId: student.id,
                user: {
                    name: student.name,
                    surname: student.surname
                }
            }));
            expect(expectedStudents).not.toEqual([]);
            for (const classData of classes) {
                const req = studentPersistence.getStudents({page: 1, pageSize: 10, skip: 0}, {classId: classData.id});
                await expect(req).resolves.toEqual({data: expect.arrayContaining(expectedStudents), totalPages: 1});
            }
        });
    });
});