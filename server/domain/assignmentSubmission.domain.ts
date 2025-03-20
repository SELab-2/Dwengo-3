import { AssignmentSubmission, ClassRole, SubmissionType } from '@prisma/client';
import { AssignmentSubmissionPersistence } from '../persistence/assignmentSubmission.persistence';
import { Request } from 'express';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import {
  SubmissionCreateSchema,
  SubmissionFilterSchema,
  SubmissionUpdateSchema,
} from '../util/types/assignmentSubmission.types';
import { UserEntity } from '../util/types/user.types';
import { checkIfUserIsInGroup } from '../util/coockie-checks/coockieChecks.util';
import { GroupPersistence } from '../persistence/group.persistence';
import { BadRequestError } from '../util/types/error.types';

export class AssignmentSubmissionDomain {
  private assignmentSubmissionPersistence: AssignmentSubmissionPersistence;
  private groupPersistence: GroupPersistence;

  public constructor() {
    this.assignmentSubmissionPersistence = new AssignmentSubmissionPersistence();
    this.groupPersistence = new GroupPersistence();
  }

  public async getAssignmentSubmissions(
    query: any,
    user: UserEntity,
  ): Promise<{ data: AssignmentSubmission[]; totalPages: number }> {
    const pagination = PaginationFilterSchema.parse(query);
    const filters = SubmissionFilterSchema.parse(query);

    await checkIfUserIsInGroup(user, filters.groupId, this.groupPersistence);

    const submissions = await this.assignmentSubmissionPersistence.getAssignmentSubmissions(
      filters,
      pagination,
    );

    if (filters.id && submissions.data.length === 1) {
      await checkIfUserIsInGroup(user, submissions.data[0].groupId, this.groupPersistence);
    }
    return submissions;
  }

  public async createAssignmentSubmission(
    req: Request,
    user: UserEntity,
  ): Promise<AssignmentSubmission> {
    if (user.role !== ClassRole.STUDENT) {
      throw new BadRequestError(40033);
    }

    const data = SubmissionCreateSchema.parse(req.body);

    if (data.submissionType === SubmissionType.FILE) {
      if (!req.file) {
        throw new BadRequestError(40034);
      }
      data.submission = {
        fileName: req.file!.originalname,
        filePath: req.file!.path,
      };
    }

    await checkIfUserIsInGroup(user, data.groupId, this.groupPersistence);
    return this.assignmentSubmissionPersistence.createAssignmentSubmission(data);
  }

  public async updateAssignmentSubmission(
    req: Request,
    user: UserEntity,
  ): Promise<AssignmentSubmission> {
    if (user.role !== ClassRole.STUDENT) {
      throw new BadRequestError(40033);
    }

    const data = SubmissionUpdateSchema.parse(req.body);

    if (data.submissionType === SubmissionType.FILE) {
      if (!req.file) {
        throw new BadRequestError(40034);
      }
      data.submission = {
        fileName: req.file!.originalname,
        filePath: req.file!.path,
      };
    }

    return this.assignmentSubmissionPersistence.updateAssignmentSubmission(data);
  }
}
