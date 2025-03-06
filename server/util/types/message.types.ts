import { z } from "zod";

export const MessageFilterSchema = z.object({
    discussionId: z.string().uuid()
});

export const MessageCreateSchema = z.object({
    discussionId: z.string().uuid(),
    content: z.string(),
    senderId: z.string(),
})

export type MessageFilterParams = z.infer<typeof MessageFilterSchema>;
export type MessageCreateParams = z.infer<typeof MessageCreateSchema>;