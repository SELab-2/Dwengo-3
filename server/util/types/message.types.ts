import { z } from "zod";

export const MessageFilterSchema = z.object({
  discussionId: z.string().uuid(),
});

export const MessageCreateSchema = z.object({
  discussionId: z.string().uuid(),
  content: z.string(),
  senderId: z.string(),
});

export const MessageUpdateSchema = z.object({
  id: z.number().positive().safe(),
  content: z.string(),
});

export const MessageIdSchema = z.number().positive().safe();

export type MessageFilterParams = z.infer<typeof MessageFilterSchema>;
export type MessageCreateParams = z.infer<typeof MessageCreateSchema>;
export type MessageUpdateParams = z.infer<typeof MessageUpdateSchema>;
export type MessageId = z.infer<typeof MessageIdSchema>;
