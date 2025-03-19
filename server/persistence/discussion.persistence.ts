import { Discussion, PrismaClient, Prisma } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton";
import {
  DiscussionCreateParams,
  DiscussionDetail,
  DiscussionFilterParams,
  discussionShort,
} from "../util/types/discussion.types";
import { PaginationParams } from "../util/types/pagination.types";
import { searchAndPaginate } from "../util/pagination/pagination.util";
import { discussionSelectDetail, discussionSelectShort } from "../util/selectInput/discussion.select";
import { Uuid } from "../util/types/assignment.types";

export class DiscussionPersistence {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async getDiscussions(
    filters: DiscussionFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: discussionShort[]; totalPages: number }> {
    const whereClause: Prisma.DiscussionWhereInput = {
      AND: [
        filters.groupIds ? { groupId: { in: filters.groupIds } } : {},
      ],
    };
    return searchAndPaginate(this.prisma.discussion, whereClause, paginationParams, undefined, discussionSelectShort);
  }

  public async getDiscussionById (id: Uuid): Promise<DiscussionDetail> {
    return this.prisma.discussion.findUniqueOrThrow({
      where: {id: id},
      select: discussionSelectDetail
    });
  }

  public async createDiscussion(
    params: DiscussionCreateParams,
  ): Promise<DiscussionDetail> {
    return this.prisma.discussion.create({
      data: {
        group: {
          connect: {
            id: params.groupId,
          },
        },
        members: {
          connect: params.members.map((member) => ({ id: member })),
        },
      },
      select: discussionSelectDetail
    });
  }
}
