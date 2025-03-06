import { Discussion, PrismaClient, Prisma } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton"
import { DiscussionCreateParams, DiscussionFilterParams } from "../util/types/discussion.types";
import { PaginationParams } from "../util/types/pagination.types";

export class DiscussionPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = PrismaSingleton.instance;
    }

    public async getDiscussions(
        filters: DiscussionFilterParams,
        paginationParams: PaginationParams
    ): Promise<{data: Discussion[], totalPages: number}> {
        const whereClause: Prisma.DiscussionWhereInput = {
            AND: [
                filters.id ? {id: filters.id} : {},
                filters.groupIds ? {groupId: {in: filters.groupIds}} : {}
            ]
        }

        const [discussions, totalCount] = await this.prisma.$transaction([
            this.prisma.discussion.findMany({
                where: whereClause,
                skip: paginationParams.skip,
                take: paginationParams.pageSize
            }),
            this.prisma.discussion.count({
                where: whereClause
            })
        ]);
        return {
            data: discussions,
            totalPages: Math.ceil(totalCount / paginationParams.pageSize)
        };
    }

    public async createDiscussion(params: DiscussionCreateParams): Promise<Discussion> {
        return this.prisma.discussion.create({
            data: {
                group: {
                    connect: {
                        id: params.groupId
                    }
                },
                members: {
                    connect: params.members.map((member) => ({id: member}))
                }
            }
        })
    }
}