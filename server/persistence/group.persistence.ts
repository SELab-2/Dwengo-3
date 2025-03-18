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

export class GroupPersistence {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async getGroupById(groupId: Uuid): Promise<
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
