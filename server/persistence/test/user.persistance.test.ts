import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { getUserByEmail, getUserById, getUserRoleById, saveUser } from "../auth/users.persistance";
import { ClassRoleEnum } from "../../util/types/user.types";
import { PrismaSingleton } from "../prismaSingleton";
import { User } from ".prisma/client";
import { deleteAllData, insertUsers } from "./testData";

let users: User[] = []

describe("user persistence test", () => {
    beforeAll(async () => {
        users = await insertUsers();
    });
    
    afterAll(async () => {
        await deleteAllData();
        await PrismaSingleton.instance.$disconnect();
    });

    describe("get user by email", () => {
        test("request with existing email responds correctly", async () => {
            for (const user of users) {
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
            for (const user of users) {
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
            for (const user of users) {
                const req = getUserRoleById(user.id);
                await expect(req).resolves.toStrictEqual({role: user.role});
            }
        });
    });
});