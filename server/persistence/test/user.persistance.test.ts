import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { getUserByEmail, getUserById, getUserRoleById, saveUser } from "../auth/users.persistance";
import { ClassRoleEnum } from "../../util/types/user.types";
import { PrismaSingleton } from "../prismaSingleton";
import { User } from ".prisma/client";

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

let dbUsers: User[] = []

describe("user persistence test", () => {
    beforeAll(async () => {
        const requests = users.map((user) => saveUser(user));
        dbUsers = await Promise.all(requests);
    });
    
    afterAll(async () => {
        await PrismaSingleton.instance.user.deleteMany();
        await PrismaSingleton.instance.$disconnect();
    });

    describe("get user by email", () => {
        test("request with existing email responds correctly", async () => {
            for (const user of dbUsers) {
                const req = getUserByEmail(user.email);
                let expectedUser;
                if (user.role === ClassRoleEnum.STUDENT) {
                    expectedUser = {...user, teacher: null};
                } else {
                    expectedUser = {...user, student: null};
                }
                await expect(req).resolves.toStrictEqual(expectedUser);
            }
        });
    });

    describe("get user by id", () => {
        test("request with existing id responds correctly", async () => {
            for (const user of dbUsers) {
                const req = getUserById(user.id);
                let expectedUser;
                if (user.role === ClassRoleEnum.STUDENT) {
                    expectedUser = {...user, teacher: null};
                } else {
                    expectedUser = {...user, student: null};
                }
                await expect(req).resolves.toStrictEqual(expectedUser);
            }
        });
    });

    describe("get user role by id", () => {
        test("request with existing id responds correctly", async () => {
            for (const user of dbUsers) {
                const req = getUserRoleById(user.id);
                await expect(req).resolves.toStrictEqual({role: user.role});
            }
        })
    });
});