import { Message, Prisma, PrismaClient } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton";
import {
  MessageCreateParams,
  MessageDetail,
  MessageFilterParams,
  MessageId,
  MessageUpdateParams,
} from "../util/types/message.types";
import { PaginationParams } from "../util/types/pagination.types";
import { searchAndPaginate } from "../util/pagination/pagination.util";
import { messageSelectDetail } from "../util/selectInput/message.select";
import { Uuid } from "../util/types/assignment.types";

export class MessagePersistence {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async getMessages(
    filters: MessageFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: MessageDetail[]; totalPages: number }> {
    const whereclause: Prisma.MessageWhereInput = {
      AND: [
        filters.discussionId ? { discussionId: filters.discussionId } : {},
      ],
    };
    return searchAndPaginate(this.prisma.message, whereclause, paginationParams, undefined, messageSelectDetail)
  }

  public async getMessageById(id: MessageId): Promise<MessageDetail> {
    return this.prisma.message.findUniqueOrThrow({
      where: {id: id},
      select: messageSelectDetail
    });
  }

  public async createMessage(params: MessageCreateParams): Promise<MessageDetail> {
    return this.prisma.message.create({
      data: {
        discussion: {
          connect: {
            id: params.discussionId,
          },
        },
        sender: {
          connect: {
            id: params.senderId!,
          },
        },
        content: params.content,
      },
      select: messageSelectDetail
    });
  }

  public async deleteMessage(id: MessageId): Promise<MessageDetail> {
    return this.prisma.message.delete({
      where: {
        id: id,
      },
      select: messageSelectDetail
    });
  }
}
