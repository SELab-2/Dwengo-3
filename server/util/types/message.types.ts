import { z } from 'zod';
import { Uuid } from './assignment.types';
import { UserShort } from './user.types';

export const MessageFilterSchema = z
  .object({
    discussionId: z.string().uuid().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one filter must be provided.',
    path: [],
  });

export const MessageCreateSchema = z.object({
  discussionId: z.string().uuid(),
  content: z.string(),
  senderId: z.string().optional(),
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
export type MessageDetail = {
  id: MessageId;
  content: string;
  sender: UserShort;
  createdAt: Date;
};
