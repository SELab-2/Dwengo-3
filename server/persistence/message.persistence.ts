import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import {
  MessageCreateParams,
  MessageDetail,
  MessageFilterParams,
  MessageId,
} from '../util/types/message.types';
import { PaginationParams } from '../util/types/pagination.types';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import {
  messageSelectDetail,
  messageSelectShort,
} from '../util/selectInput/message.select';

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
      AND: [filters.discussionId ? { discussionId: filters.discussionId } : {}],
    };
    return searchAndPaginate(
      this.prisma.message,
      whereclause,
      paginationParams,
      undefined,
      messageSelectShort,
    );
  }

  public async getMessageById(id: MessageId): Promise<MessageDetail> {
    const message = await this.prisma.message.findUnique({
      where: { id: id },
      select: messageSelectDetail,
    });

    if (!message) {
      throw new Error(`Message with id: ${id} was not found`);
    }

    return message;
  }

  public async createMessage(
    params: MessageCreateParams,
  ): Promise<MessageDetail> {
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
      select: messageSelectDetail,
    });
  }

  public async deleteMessage(id: MessageId): Promise<MessageDetail> {
    return this.prisma.message.delete({
      where: {
        id: id,
      },
      select: messageSelectDetail,
    });
  }
}
