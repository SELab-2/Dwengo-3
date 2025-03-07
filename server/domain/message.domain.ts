import { MessagePersistence } from "../persistence/message.persistence";
import { queryWithPaginationParser } from "../util/pagination/queryWithPaginationParser.util";
import { MessageCreateSchema, MessageFilterSchema, MessageIdSchema, MessageUpdateSchema } from "../util/types/message.types";

export class MessageDomain {
    private messagePersistence: MessagePersistence;

    public constructor() {
        this.messagePersistence = new MessagePersistence();
    }

    public async getMessages(query: any) {
        const parseResult = queryWithPaginationParser(query, MessageFilterSchema);
        return this.messagePersistence.getMessages(parseResult.dataSchema, parseResult.dataPagination);
    }

    public async createMessage(query: any) {
        const parseResult = MessageCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.messagePersistence.createMessage(parseResult.data);
    }

    public async updateMessage(query: any) {
        const parseResult = MessageUpdateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.messagePersistence.updateMessage(parseResult.data);
    }

    public async deleteMessage(id: string) {
        const parseResult = MessageIdSchema.safeParse(id);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.messagePersistence.deleteMessage(parseResult.data);
    }
}