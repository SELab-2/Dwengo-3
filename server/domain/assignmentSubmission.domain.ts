import { AssignmentSubmission, SubmissionType } from "@prisma/client";
import { AssignmentSubmissionPersistence } from "../persistence/assignmentSubmission.persistence";
import { Request } from 'express';
import { PaginationFilterSchema } from "../util/types/pagination.types";
import { SubmissionFilterSchema, SubmissionUpdateSchema, FileSubmission } from "../util/types/assignmentSubmission.types";

export class AssignmentSubmissionDomain {
    private assignmentSubPersistence: AssignmentSubmissionPersistence;

    public constructor() {
        this.assignmentSubPersistence = new AssignmentSubmissionPersistence();
    }

    public async getAssignmentSubmissions(query: any): Promise<{data: AssignmentSubmission[], totalPages: number}> {
        const paginationParseResult = PaginationFilterSchema.safeParse(query);
        if (!paginationParseResult.success) {
            throw paginationParseResult.error;
        }
        const parseResult = SubmissionFilterSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.assignmentSubPersistence.getAssignmentSubmissions(
            parseResult.data,
            paginationParseResult.data
        );
    }

    /*
    public async createAssignmentSubmission(query: any): Promise<AssignmentSubmission> {
        const parseResult =  SubmissionSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.assignmentSubPersistence.createAssignmentSubmission(parseResult.data);
    }
    */

    public async updateAssignmentSubmission(req: Request): Promise<AssignmentSubmission> {
        //console.log(req.body);
        const parseResult = SubmissionUpdateSchema.safeParse(req.body);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        if (parseResult.data.submissionType === SubmissionType.FILE) {
            if (!req.file) {
                throw new Error("File submission is required when submissionType is FILE");
            }
            const fileSubmission: FileSubmission = {
                fileName: req.file!.originalname,
                filePath: req.file!.path
            }
            parseResult.data.submission = fileSubmission;
        }
        return this.assignmentSubPersistence.updateAssignmentSubmission(parseResult.data);
    }
}