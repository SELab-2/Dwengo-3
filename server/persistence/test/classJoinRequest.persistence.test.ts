import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { ClassJoinRequestDetail } from "../../util/types/classJoinRequest.types";
import { ClassPersistence } from "../class.persistence";
import { ClassJoinRequestPersistence } from "../classJoinRequest.persistence";
import { deleteAllData, insertClassJoinRequests } from "./testData";
import { PrismaSingleton } from "../prismaSingleton";

let classJoinRequests: ClassJoinRequestDetail[] = [];
const classPersistence: ClassPersistence = new ClassPersistence();
const classJoinRequestPersistence: ClassJoinRequestPersistence = new ClassJoinRequestPersistence();

describe("classJoinRequest persistence test", () => {
    beforeAll(async () => {
        classJoinRequests = await insertClassJoinRequests();
    });

    afterAll(async () => {
        await deleteAllData();
        await PrismaSingleton.instance.$disconnect();
    });

    describe("test check if join request exists", () => {
        test("request with existing id responds with true", async () => {
            for (const classJoinRequest of classJoinRequests) {
                const req = classJoinRequestPersistence.checkIfJoinRequestExists(classJoinRequest.class.id, classJoinRequest.user.id);
                await expect(req).resolves.not.toBeFalsy();
            }
        });

        test("request with unexisting id responds with false", async () => {
            for (const classJoinRequest of classJoinRequests) {
                const req = classJoinRequestPersistence.checkIfJoinRequestExists(classJoinRequest.class.id, "qdjfqmfqmfj");
                await expect(req).resolves.toBeFalsy();
            }
        });
    });

    describe("test get join request", () => {
        test("request with existing class id responds with array of classJoinRequests", async () => {
            for (const classJoinRequest of classJoinRequests) {
                const classId = classJoinRequest.class.id;
                const user = classJoinRequest.user;
                const req = classJoinRequestPersistence.getJoinRequests({page: 1, pageSize: 10, skip: 0}, {classId: classId}, user.role);
                const expectedRequests = classJoinRequests.filter((request) => request.class.id === classJoinRequest.class.id && request.user.role === classJoinRequest.user.role);
                await expect(req).resolves.toEqual({data: expect.arrayContaining(expectedRequests), totalPages: 1});
            }
        });

        test("request with existing user id responds with array of classJoinRequests", async () => {
            for (const classJoinRequest of classJoinRequests) {
                const user = classJoinRequest.user;
                const req = classJoinRequestPersistence.getJoinRequests({page: 1, pageSize: 10, skip: 0}, {userId: user.id}, user.role);
                await expect(req).resolves.toEqual({data: expect.arrayContaining([classJoinRequest]), totalPages: 1});
            }
        });
    });

    describe("test is teacher of class from request", () => {
        test("request with existing teacher id responds with true", async () => {
            for (const joinRequest of classJoinRequests) {
                const classData = await classPersistence.getClassById(joinRequest.class.id);
                for (const teacher of classData.teachers) {
                    const req = classJoinRequestPersistence.isTeacherOfClassFromRequest(joinRequest.id, teacher.userId);
                    await expect(req).resolves.not.toBeFalsy();
                }
            }
        });

        test("request with existing teacher id responds with false", async () => {
            for (const joinRequest of classJoinRequests) {
                const req = classJoinRequestPersistence.isTeacherOfClassFromRequest(joinRequest.id, "fjqflmqfkq");
                await expect(req).resolves.toBeFalsy();
            }
        });
    });

    describe("test handle join request", () => {
        test("request with existing join request id and with accept should delete request and update class", async () => {
            for (const joinRequest of classJoinRequests) {
                await classJoinRequestPersistence.handleJoinRequest({requestId: joinRequest.id, acceptRequest: true});
                const req1 = classJoinRequestPersistence.checkIfJoinRequestExists(joinRequest.class.id, joinRequest.user.id);
                await expect(req1).resolves.toBeFalsy();
                const req2 = classPersistence.getClassById(joinRequest.class.id);
                await expect(req2.then(((res) => res.students))).resolves.not.toEqual([]);
            }
        });
    });
});