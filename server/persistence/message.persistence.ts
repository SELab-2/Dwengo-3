import { Message, Prisma, PrismaClient } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton";
import {
  MessageCreateParams,
  MessageFilterParams,
  MessageId,
  MessageUpdateParams,
} from "../util/types/message.types";
import { PaginationParams } from "../util/types/pagination.types";

export class MessagePersistence {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = PrismaSingleton.instance;
  }

    public async getMessages(
        filters: MessageFilterParams,
        paginationParams: PaginationParams
    ): Promise<{data: Message[], totalPages: number}> {
        const whereclause: Prisma.MessageWhereInput = {
            AND: [
                filters.discussionId ? {discussionId: filters.discussionId} : {},
                filters.id ? {id: filters.id} : {}
            ]
        };
        const [messages, totalCount] = await this.prisma.$transaction([
            this.prisma.message.findMany({
                where: whereclause,
                skip: paginationParams.skip,
                take: paginationParams.pageSize,
                include: {sender: true},
                orderBy: {createdAt: "desc"}
            }),
            this.prisma.message.count({
                where: whereclause
            })
        ]);
        return {
            data: messages,
            totalPages: Math.ceil(totalCount / paginationParams.pageSize)
        };
    }

    public async createMessage(params: MessageCreateParams): Promise<Message> {
        return this.prisma.message.create({
            data: {
                discussion: {
                    connect: {
                        id: params.discussionId
                    }
                },
                sender: {
                    connect: {
                        id: params.senderId!
                    }
                },
                content: params.content
            }
        });
    }

  public async updateMessage(params: MessageUpdateParams): Promise<Message> {
    return this.prisma.message.update({
      where: {
        id: params.id,
      },
      data: {
        content: params.content,
      },
    });
  }

  public async deleteMessage(id: MessageId): Promise<Message> {
    return this.prisma.message.delete({
      where: {
        id: id,
      },
    });
  }
}
