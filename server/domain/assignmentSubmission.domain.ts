import { ClassRole, SubmissionType } from '@prisma/client';
import { AssignmentSubmissionPersistence } from '../persistence/assignmentSubmission.persistence';
import { Request } from 'express';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import {
  AssignmentSubmissionDetail,
  AssignmentSubmissionShort,
  SubmissionCreateSchema,
  SubmissionFilterSchema,
  SubmissionUpdateSchema,
} from '../util/types/assignmentSubmission.types';
import { UserEntity } from '../util/types/user.types';
import { checkIfUserIsInGroup } from '../util/cookie-checks/cookieChecks.util';
import { GroupPersistence } from '../persistence/group.persistence';
import { BadRequestError, NotFoundError } from '../util/types/error.types';
import { Uuid } from '../util/types/assignment.types';
import { LearningPathNodePersistence } from '../persistence/learningPathNode.persistence';

export class AssignmentSubmissionDomain {
  private assignmentSubmissionPersistence: AssignmentSubmissionPersistence;
  private groupPersistence: GroupPersistence;
  private learningPathNodePersistence: LearningPathNodePersistence;

  public constructor() {
    this.assignmentSubmissionPersistence = new AssignmentSubmissionPersistence();
    this.groupPersistence = new GroupPersistence();
    this.learningPathNodePersistence = new LearningPathNodePersistence();
  }

  public async getAssignmentSubmissions(
    query: any,
    user: UserEntity,
  ): Promise<{ data: AssignmentSubmissionShort[]; totalPages: number }> {
    const pagination = PaginationFilterSchema.parse(query);
    const filters = SubmissionFilterSchema.parse(query);

    await checkIfUserIsInGroup(user, filters.groupId, this.groupPersistence);
    return this.assignmentSubmissionPersistence.getAssignmentSubmissions(filters, pagination);
  }

  public async getAssignmentSubmissionById(id: Uuid, user: UserEntity) {
    const submission = await this.assignmentSubmissionPersistence.getAssignmentSubmissionById(id);
    await checkIfUserIsInGroup(user, submission.group.id, this.groupPersistence);
    return submission;
  }

  public async createAssignmentSubmission(
    req: Request,
    user: UserEntity,
  ): Promise<AssignmentSubmissionDetail> {
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

    const groupData = await this.groupPersistence.getGroupByIdWithCustomIncludes(data.groupId);
    if (
      !groupData ||
      !groupData.students.some((student) => user.student && student.id === user.student.id)
    ) {
      throw new BadRequestError(40039);
    }

    const node = await this.learningPathNodePersistence.getLearningPathNodeById(data.nodeId);

    if (node.index > Math.max(...groupData.progress)) {
      const new_progress = [...groupData.progress, node.index];
      await this.groupPersistence.updateGroupProgress(data.groupId, new_progress);
    }

    return this.assignmentSubmissionPersistence.createAssignmentSubmission(data);
  }

  public async updateAssignmentSubmission(
    req: Request,
    user: UserEntity,
  ): Promise<AssignmentSubmissionDetail> {
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
