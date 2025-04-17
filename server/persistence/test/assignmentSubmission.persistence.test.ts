import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AssignmentSubmissionDetail, FileSubmission } from "../../util/types/assignmentSubmission.types";
import { AssignmentSubmissionPersistence } from "../assignmentSubmission.persistence";
import { deleteAllData, insertAssignmentsSubmissions } from "./testData";
import { PrismaSingleton } from "../prismaSingleton";
import { MultipleChoice, SubmissionTypeEnum } from "../../util/types/learningObject.types";
import { LearningObjectPersistence } from "../learningObject.persistence";

let submissions: AssignmentSubmissionDetail[];
const assignemntSubmissionPersistence: AssignmentSubmissionPersistence = new AssignmentSubmissionPersistence();
const learningObjectPersistence: LearningObjectPersistence = new LearningObjectPersistence();

describe("assignmentSubmission persistence test", () => {
    beforeAll(async () => {
        submissions = await insertAssignmentsSubmissions();
        expect(submissions).not.toEqual([]);
    });

    afterAll(async () => {
        await deleteAllData();
        await PrismaSingleton.instance.$disconnect();
    })

    describe("test get assignmentSubmission by id", () => {
        test("request with existing id responds correctly", async () => {
            for (const submission of submissions) {
                const req = assignemntSubmissionPersistence.getAssignmentSubmissionById(submission.id);
                await expect(req).resolves.toStrictEqual(submission);
            }
        });

        test("request with unexisting id responds with an error", async () => {
            const req = assignemntSubmissionPersistence.getAssignmentSubmissionById("ksqfklqsdfkl");
            await expect(req).rejects.toThrow();
        });
    });

    describe("test get assignmentSubmissions", () => {
        test("request with existing groupId responds correctly", async () => {
            for (const submission of submissions) {
                const req = assignemntSubmissionPersistence.getAssignmentSubmissions({groupId: submission.group!.id}, {page: 1, pageSize: 10, skip: 0});
                const exptectedSubmissions = submissions.filter((sub) => sub.group!.id === submission.group!.id).map((sub) => ({
                    id: sub.id
                }));
                expect(exptectedSubmissions).not.toEqual([]);
                await expect(req).resolves.toStrictEqual({data: expect.arrayContaining(exptectedSubmissions), totalPages: 1});
            }
        });

        test("request with existing nodeId and groupId responds correctly", async () => {
            for (const submission of submissions) {
                const req = assignemntSubmissionPersistence.getAssignmentSubmissions({groupId: submission.group!.id, nodeId: submission.node.id}, {page: 1, pageSize: 10, skip: 0});
                const expectedSubmission = {id: submission.id};
                await expect(req).resolves.toStrictEqual({data: [expectedSubmission], totalPages: 1});
            }
        });
    });

    describe("test update assignmentSubmission", () => {
        test("request with existing id should update assignmentSubmission correctly", async () => {
            for (const submission of submissions) {
                let newSubmission;
                if (submission.submissionType === SubmissionTypeEnum.Enum.MULTIPLE_CHOICE) {
                    const learningObject = await learningObjectPersistence.getLearningObjectById(submission.node.learningObject.id);
                    const multipleChoice = learningObject.multipleChoice as MultipleChoice;
                    newSubmission = multipleChoice.options[1];
                } else if (submission.submissionType === SubmissionTypeEnum.Enum.FILE) {
                    newSubmission = {
                        fileName: "newFile.txt",
                        filePath: "files-submissions/atoitjklfnqfn.txt"
                    } as FileSubmission;
                }
                const req = assignemntSubmissionPersistence.updateAssignmentSubmission(submission.id, {
                    submissionType: submission.submissionType,
                    submission: newSubmission!
                });
                submission.submission = newSubmission!;
                await expect(req).resolves.toStrictEqual(submission);
                const req2 = assignemntSubmissionPersistence.getAssignmentSubmissionById(submission.id);
                await expect(req).resolves.toStrictEqual(submission);
            }
        });
    });
});