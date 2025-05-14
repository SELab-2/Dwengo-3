import { ClassRole } from '@prisma/client';
import { MessagePersistence } from '../persistence/message.persistence';
import { queryWithPaginationParser } from '../util/pagination/queryWithPaginationParser.util';
import {
  MessageCreateSchema,
  MessageDetail,
  MessageFilterSchema,
  MessageIdSchema,
} from '../util/types/message.types';
import { UserEntity } from '../util/types/user.types';
import { DiscussionDomain } from './discussion.domain';
import { BadRequestError } from '../util/types/error.types';

export class MessageDomain {
  private messagePersistence: MessagePersistence;
  private discussionDomain: DiscussionDomain;

  public constructor() {
    this.messagePersistence = new MessagePersistence();
    this.discussionDomain = new DiscussionDomain();
  }

  public async getMessages(
    query: any,
    user: UserEntity,
  ): Promise<{ data: MessageDetail[]; totalPages: number }> {
    const parseResult = queryWithPaginationParser(query, MessageFilterSchema);
    const filters = parseResult.dataSchema;

    if (filters.discussionId) {
      // this checks if user is part of the discussion
      await this.discussionDomain.getDiscussionById(filters.discussionId, user);
    }
    return this.messagePersistence.getMessages(filters, parseResult.dataPagination);
  }

  public async createMessage(query: any, user: UserEntity): Promise<MessageDetail> {
    const data = MessageCreateSchema.parse(query);
    // await this.discussionDomain.getDiscussions({ groupIds: [data.discussionId] }, user); //this checks if user is part of the discussion
    if (user.role === ClassRole.TEACHER) {
      data.senderId = user.teacher!.userId;
    } else if (user.role == ClassRole.STUDENT) {
      data.senderId = user.student!.userId;
    }
    return this.messagePersistence.createMessage(data);
  }

  public async deleteMessage(id: number, user: UserEntity): Promise<MessageDetail> {
    const messageId = MessageIdSchema.parse(id);
    const message = await this.messagePersistence.getMessageById(messageId);
    if (
      (user.role === ClassRole.TEACHER && user.teacher!.userId !== message.sender.id) ||
      (user.role === ClassRole.STUDENT && user.student!.userId !== message.sender.id)
    ) {
      throw new BadRequestError(40008);
    }
    return this.messagePersistence.deleteMessage(messageId);
  }
}
