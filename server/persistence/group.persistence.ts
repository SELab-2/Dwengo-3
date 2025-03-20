import {
  Assignment,
  Class,
  Group,
  PrismaClient,
  Student,
  Teacher,
} from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { Uuid } from '../util/types/assignment.types';
import { groupSelectDetail } from '../util/selectInput/group.select';

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
}
