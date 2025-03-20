import { ClassRole, Message } from '@prisma/client';
import { MessagePersistence } from '../persistence/message.persistence';
import { queryWithPaginationParser } from '../util/pagination/queryWithPaginationParser.util';
import {
  MessageCreateSchema,
  MessageFilterSchema,
  MessageIdSchema,
  MessageUpdateSchema,
} from '../util/types/message.types';
import { UserEntity } from '../util/types/user.types';
import { DiscussionDomain } from './discussion.domain';
import { BadRequestError, NotFoundError } from '../util/types/error.types';

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
  ): Promise<{ data: Message[]; totalPages: number }> {
    const parseResult = queryWithPaginationParser(query, MessageFilterSchema);
    const filters = parseResult.dataSchema;

    if (filters.discussionId) {
      // this checks if user is part of the discussion
      await this.discussionDomain.getDiscussions({ id: filters.discussionId }, user);
    }

    const messages = await this.messagePersistence.getMessages(filters, parseResult.dataPagination);

    if (filters.id && messages.data.length === 1) {
      await this.discussionDomain.getDiscussions({ id: messages.data[0].discussionId }, user);
    }
    return messages;
  }

  public async createMessage(query: any, user: UserEntity): Promise<Message> {
    const data = MessageCreateSchema.parse(query);

    // this checks if user is part of the discussion
    await this.discussionDomain.getDiscussions({ id: data.discussionId }, user);

    if (user.role === ClassRole.TEACHER) {
      data.senderId = user.teacher!.userId;
    } else if (user.role == ClassRole.STUDENT) {
      data.senderId = user.student!.userId;
    }
    return this.messagePersistence.createMessage(data);
  }

  // We are not gonna use this, so there are no checks
  public async updateMessage(query: any): Promise<Message> {
    const data = MessageUpdateSchema.parse(query);
    return this.messagePersistence.updateMessage(data);
  }

  public async deleteMessage(id: string, user: UserEntity): Promise<Message> {
    const parsed_id = MessageIdSchema.parse(id);
    const message = (
      await this.messagePersistence.getMessages(
        { id: parsed_id },
        { page: 1, pageSize: 1, skip: 0 },
      )
    ).data;

    if (message.length !== 1) {
      throw new NotFoundError(40402);
    }

    if (
      (user.role === ClassRole.TEACHER && user.teacher!.userId !== message[0].senderId) ||
      (user.role === ClassRole.STUDENT && user.student!.userId !== message[0].senderId)
    ) {
      throw new BadRequestError(40008);
    }
    return this.messagePersistence.deleteMessage(parsed_id);
  }
}
