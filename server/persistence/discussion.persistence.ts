import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import {
  DiscussionCreateParams,
  DiscussionDetail,
  DiscussionFilterParams,
  DiscussionShort,
} from '../util/types/discussion.types';
import { PaginationParams } from '../util/types/pagination.types';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import {
  discussionSelectDetail,
  discussionSelectShort,
} from '../util/selectInput/discussion.select';
import { Uuid } from '../util/types/assignment.types';
import { NotFoundError } from '../util/types/error.types';

export class DiscussionPersistence {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async getDiscussions(
    filters: DiscussionFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: DiscussionShort[]; totalPages: number }> {
    const whereClause: Prisma.DiscussionWhereInput = {
      AND: [filters.userId ? { members: { some: { id: filters.userId } } } : {}],
    };

    return searchAndPaginate(
      this.prisma.discussion,
      whereClause,
      paginationParams,
      undefined,
      discussionSelectShort,
    );
  }

  public async getDiscussionById(id: Uuid): Promise<DiscussionDetail> {
    const discussion = await this.prisma.discussion.findUniqueOrThrow({
      where: { id: id },
      select: discussionSelectDetail,
    });

    if (!discussion) {
      throw new NotFoundError(40410);
    }

    return discussion;
  }

  public async createDiscussion(
    params: DiscussionCreateParams,
    memberIds: string[],
  ): Promise<DiscussionDetail> {
    return this.prisma.discussion.create({
      data: {
        group: {
          connect: {
            id: params.groupId,
          },
        },
        members: {
          connect: memberIds.map((member) => ({ id: member })),
        },
      },
      select: discussionSelectDetail,
    });
  }
}
