import { AssignmentSubmission, SubmissionType } from "@prisma/client";
import { AssignmentSubmissionPersistence } from "../persistence/assignmentSubmission.persistence";
import { Request } from "express";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import { SubmissionFilterSchema, FileSubmission, SubmissionCreateSchema, SubmissionUpdateSchema } from "../util/types/assignmentSubmission.types";
import { z, ZodEffects, ZodObject } from "zod";

export class AssignmentSubmissionDomain {
  private assignmentSubmissionPersistence: AssignmentSubmissionPersistence;

  public constructor() {
    this.assignmentSubmissionPersistence =
      new AssignmentSubmissionPersistence();
  }

  public async getAssignmentSubmissions(
    query: any,
  ): Promise<{ data: AssignmentSubmission[]; totalPages: number }> {
    const paginationParseResult = PaginationFilterSchema.safeParse(query);
    if (!paginationParseResult.success) {
      throw paginationParseResult.error;
    }
    const parseResult = SubmissionFilterSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    return this.assignmentSubmissionPersistence.getAssignmentSubmissions(
      parseResult.data,
      paginationParseResult.data,
    );
  }

  public async createAssignmentSubmission(
    req: Request,
  ): Promise<AssignmentSubmission> {
    return this.assignmentSubmissionPersistence.createAssignmentSubmission(
      this.parseSubmissionRequest(req, SubmissionCreateSchema),
    );
  }

  public async updateAssignmentSubmission(
    req: Request,
  ): Promise<AssignmentSubmission> {
    return this.assignmentSubmissionPersistence.updateAssignmentSubmission(
      this.parseSubmissionRequest(req, SubmissionUpdateSchema)
    );
  }

  private parseSubmissionRequest<T extends ZodObject<any> | ZodEffects<ZodObject<any>>>(
    req: Request, schema: T
  ): z.infer<typeof schema> {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    if (parseResult.data.submissionType === SubmissionType.FILE) {
      if (!req.file) {
        throw new Error(
          "File submission is required when submissionType is FILE",
        );
      }
      const fileSubmission: FileSubmission = {
        fileName: req.file!.originalname,
        filePath: req.file!.path,
      };
      parseResult.data.submission = fileSubmission;
    }
    return parseResult.data;
  }
}
