import {
  AssignmentSubmission,
  ClassRole,
  SubmissionType,
} from '@prisma/client';
import { AssignmentSubmissionPersistence } from '../persistence/assignmentSubmission.persistence';
import { Request } from 'express';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import {
  SubmissionFilterSchema,
  FileSubmission,
  SubmissionCreateSchema,
  SubmissionUpdateSchema,
} from '../util/types/assignmentSubmission.types';
import { UserEntity } from '../util/types/user.types';
import {
  checkIfUserIsInGroup,
  compareUserIdWithFilterId,
} from '../util/coockie-checks/coockieChecks.util';
import { GroupPersistence } from '../persistence/group.persistence';
import { z, ZodEffects, ZodObject } from 'zod';

export class AssignmentSubmissionDomain {
  private assignmentSubmissionPersistence: AssignmentSubmissionPersistence;
  private groupPersistence: GroupPersistence;

  public constructor() {
    this.assignmentSubmissionPersistence =
      new AssignmentSubmissionPersistence();
    this.groupPersistence = new GroupPersistence();
  }

  public async getAssignmentSubmissions(
    query: any,
    user: UserEntity,
  ): Promise<{ data: AssignmentSubmission[]; totalPages: number }> {
    const paginationParseResult = PaginationFilterSchema.safeParse(query);
    if (!paginationParseResult.success) {
      throw paginationParseResult.error;
    }
    const parseResult = SubmissionFilterSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    const filters = parseResult.data;
    checkIfUserIsInGroup(user, filters.groupId, this.groupPersistence);
    const submissions =
      await this.assignmentSubmissionPersistence.getAssignmentSubmissions(
        filters,
        paginationParseResult.data,
      );
    if (filters.id && submissions.data.length === 1) {
      checkIfUserIsInGroup(
        user,
        submissions.data[0].groupId,
        this.groupPersistence,
      );
    }
    return submissions;
  }

  public async createAssignmentSubmission(
    req: Request,
    user: UserEntity,
  ): Promise<AssignmentSubmission> {
    if (user.role !== ClassRole.STUDENT) {
      throw new Error('Only students can create submissions');
    }

    const parseResult = SubmissionCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const data = parseResult.data;
    if (data.submissionType === SubmissionType.FILE) {
      if (!req.file) {
        throw new Error(
          'File submission is required when submissionType is FILE',
        );
      }
      const fileSubmission: FileSubmission = {
        fileName: req.file!.originalname,
        filePath: req.file!.path,
      };
      data.submission = fileSubmission;
    }

    checkIfUserIsInGroup(user, data.groupId, this.groupPersistence);
    return this.assignmentSubmissionPersistence.createAssignmentSubmission(
      data,
    );
  }

  public async updateAssignmentSubmission(
    req: Request,
    user: UserEntity,
  ): Promise<AssignmentSubmission> {
    if (user.role !== ClassRole.STUDENT) {
      throw new Error('Only students can create submissions');
    }

    const parseResult = SubmissionUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const data = parseResult.data;
    if (data.submissionType === SubmissionType.FILE) {
      if (!req.file) {
        throw new Error(
          'File submission is required when submissionType is FILE',
        );
      }
      const fileSubmission: FileSubmission = {
        fileName: req.file!.originalname,
        filePath: req.file!.path,
      };
      data.submission = fileSubmission;
    }

    return this.assignmentSubmissionPersistence.updateAssignmentSubmission(
      data,
    );
  }
}
