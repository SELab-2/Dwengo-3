import { Assignment, Class, Group, PrismaClient, Student, Teacher } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { Uuid } from '../util/types/assignment.types';
import { groupSelectDetail, groupSelectShort } from '../util/selectInput/select';

export class GroupPersistence {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = PrismaSingleton.instance;
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

  public async createGroups(groups: Uuid[][], assignmentId: string) {
    return await PrismaSingleton.instance.$transaction(
      groups.map((group: Uuid[], index: number) =>
        PrismaSingleton.instance.group.create({
          data: {
            name: `Group ${index + 1}`,
            assignment: {
              connect: {
                id: assignmentId,
              },
            },
            students: {
              connect: group.map((student: Uuid) => ({ id: student })),
            },
          },
          select: groupSelectShort,
        }),
      ),
    );
  }

  public async updateCurrentNodeIndex(id: string, value: number) {
    return await PrismaSingleton.instance.group.update({
      where: {
        id: id,
      },
      data: {
        currentNodeIndex: value,
      },
    });
  }
}
