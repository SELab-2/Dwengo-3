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
      await this.discussionDomain.getDiscussions(
        { id: filters.discussionId },
        user,
      ); //this checks if user is part of the discussion
    }
    return this.messagePersistence.getMessages(
      filters,
      parseResult.dataPagination,
    );
  }

  public async createMessage(
    query: any,
    user: UserEntity,
  ): Promise<MessageDetail> {
    const parseResult = MessageCreateSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    const data = parseResult.data;
    await this.discussionDomain.getDiscussions({ id: data.discussionId }, user); //this checks if user is part of the discussion
    if (user.role === ClassRole.TEACHER) {
      data.senderId = user.teacher!.userId;
    } else if (user.role == ClassRole.STUDENT) {
      data.senderId = user.student!.userId;
    }
    return this.messagePersistence.createMessage(data);
  }

  public async deleteMessage(
    id: string,
    user: UserEntity,
  ): Promise<MessageDetail> {
    const parseResult = MessageIdSchema.safeParse(id);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    const message = await this.messagePersistence.getMessageById(
      parseResult.data,
    );
    if (
      (user.role === ClassRole.TEACHER &&
        user.student!.userId !== message.sender.id) ||
      (user.role === ClassRole.STUDENT &&
        user.teacher!.userId !== message.sender.id)
    ) {
      throw new Error('You can only delete your own messages');
    }
    return this.messagePersistence.deleteMessage(parseResult.data);
  }
}
