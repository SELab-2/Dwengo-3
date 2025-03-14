import { ClassRole, Message } from "@prisma/client";
import { MessagePersistence } from "../persistence/message.persistence";
import { queryWithPaginationParser } from "../util/pagination/queryWithPaginationParser.util";
import { MessageCreateSchema, MessageFilterSchema, MessageIdSchema, MessageUpdateSchema } from "../util/types/message.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";
import { DiscussionDomain } from "./discussion.domain";
import { PaginationFilterSchema } from "../util/types/pagination.types";

export class MessageDomain {
    private messagePersistence: MessagePersistence;
    private discussionDomain: DiscussionDomain;

    public constructor() {
        this.messagePersistence = new MessagePersistence();
        this.discussionDomain = new DiscussionDomain();
    }

    public async getMessages(query: any, user: UserEntity): Promise<{data: Message[], totalPages: number}> {
        const parseResult = queryWithPaginationParser(query, MessageFilterSchema);
        const filters = parseResult.dataSchema;
        if (filters.discussionId) {
            await this.discussionDomain.getDiscussions({id: filters.discussionId}, user); //this checks if user is part of the discussion
        }
        const messages = await this.messagePersistence.getMessages(filters, parseResult.dataPagination);
        if (filters.id && messages.data.length === 1) {
            await this.discussionDomain.getDiscussions({id: messages.data[0].discussionId}, user);
        }
        return messages;
    }

    public async createMessage(query: any, user: UserEntity): Promise<Message> {
        const parseResult = MessageCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        const data = parseResult.data;
        await this.discussionDomain.getDiscussions({id: data.discussionId}, user); //this checks if user is part of the discussion
        if (user.role === ClassRole.TEACHER) {
            data.senderId = user.teacher!.userId;
        }
        else if (user.role == ClassRole.STUDENT) {
            data.senderId = user.student!.userId;
        }
        return this.messagePersistence.createMessage(data);
    }

    //We are not gonna use this, so there are no checks
    public async updateMessage(query: any): Promise<Message> {
        const parseResult = MessageUpdateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.messagePersistence.updateMessage(parseResult.data);
    }

    public async deleteMessage(id: string, user: UserEntity): Promise<Message> {
        const parseResult = MessageIdSchema.safeParse(id);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        const message = (await this.messagePersistence.getMessages({id: parseResult.data}, {page: 1, pageSize: 1, skip: 0})).data;
        if (message.length !== 1) {
            throw new Error("message not found");
        }
        if (
            (user.role === ClassRole.TEACHER && user.student!.userId !== message[0].senderId) ||
            (user.role === ClassRole.STUDENT && user.teacher!.userId !== message[0].senderId)) {
            throw new Error("You can only delete your own messages");
        }
        return this.messagePersistence.deleteMessage(parseResult.data);
    }
}
