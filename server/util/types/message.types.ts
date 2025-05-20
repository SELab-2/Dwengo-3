import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { messageSelectDetail, messageSelectShort } from '../selectInput/select';
import { ContentZod, DiscussionIdZod, MessageIdZod, UserIdZod } from './util_types';

export const MessageFilterSchema = z.object({
  discussionId: DiscussionIdZod,
});

export const MessageCreateSchema = z.object({
  discussionId: DiscussionIdZod,
  content: ContentZod,
  senderId: UserIdZod,
});

export const MessageUpdateSchema = z.object({
  id: MessageIdZod,
  content: ContentZod,
});

export type MessageFilterParams = z.infer<typeof MessageFilterSchema>;
export type MessageCreateParams = z.infer<typeof MessageCreateSchema>;
export type MessageUpdateParams = z.infer<typeof MessageUpdateSchema>;
export type MessageDetail = Prisma.MessageGetPayload<{ select: typeof messageSelectDetail }>;
export type MessageShort = Prisma.MessageGetPayload<{ select: typeof messageSelectShort }>;
