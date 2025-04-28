import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { messageSelectDetail, messageSelectShort } from '../selectInput/message.select';

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
  id: z.number().positive(),
  content: z.string(),
});

export const MessageIdSchema = z.number().positive();

export type MessageFilterParams = z.infer<typeof MessageFilterSchema>;
export type MessageCreateParams = z.infer<typeof MessageCreateSchema>;
export type MessageUpdateParams = z.infer<typeof MessageUpdateSchema>;
export type MessageId = z.infer<typeof MessageIdSchema>;
export type MessageDetail = Prisma.MessageGetPayload<{ select: typeof messageSelectDetail }>;
export type MessageShort = Prisma.MessageGetPayload<{ select: typeof messageSelectShort }>;
