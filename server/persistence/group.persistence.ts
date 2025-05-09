import { Assignment, Class, Group, PrismaClient, Student, SubmissionType, Teacher } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { Uuid } from '../util/types/assignment.types';
import { assignmentSelectDetail, groupSelectDetail } from '../util/selectInput/select';
import { GroupDetail } from '../util/types/group.types';
import { FileSubmission } from '../util/types/assignmentSubmission.types';
import fs from 'fs';
import { AssignmentSubmissionPersistence } from './assignmentSubmission.persistence';

export class GroupPersistence {
  private prisma: PrismaClient;
  private submissionPersistence: AssignmentSubmissionPersistence;

  public constructor() {
    this.prisma = PrismaSingleton.instance;
    this.submissionPersistence = new AssignmentSubmissionPersistence();
  }

  public async getGroupById(groupId: Uuid) {
    return this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: groupSelectDetail,
    });
  }

  public async getGroupByIdWithCustomIncludes(groupId: Uuid): Promise<
    | (Group & {
        assignment: Assignment & { class: Class & { teachers: Teacher[] } };
        students: Student[];
      })
    | null
  > {
    return this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        assignment: {
          include: {
            class: {
              include: {
                teachers: true,
              },
            },
          },
        },
        students: true,
      },
    });
  }

  public async updateGroupProgress(groupId: string, progress: number[]) {
    return this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        progress,
      },
    });
  }

  public async deleteStudentFromGroup(studentId: string, groupId: string) {
    const group = await this.prisma.group.update({
      where: { id: groupId },
      data: {
        students: {
          disconnect: {id: studentId}
        }
      },
      select: groupSelectDetail
    });
    if (group.students.length == 0) {
      await this.deleteGroup(group);
    }
  }

  private async deleteGroup(group: GroupDetail) {
    if (group.discussion?.id) {
      await this.prisma.discussion.delete({
        where: { id: group.discussion.id }
      });
    }    

    await this.submissionPersistence.deleteAssignmentSubmissions(
      { groupId: group.id }
    );

    await this.prisma.group.delete({
      where: { id: group.id }
    });

    const remainingGroups = await this.prisma.group.findMany({
      where: { assignmentId: group.assignment.id }
    });

    if (remainingGroups.length === 0) {
      await this.prisma.assignment.delete({
        where: { id: group.assignment.id }
      });
    }

  }
}
