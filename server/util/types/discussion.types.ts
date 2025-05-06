import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { discussionSelectDetail, discussionSelectShort } from '../selectInput/select';

export const DiscussionFilterSchema = z.object({
  userId: z.string().optional(), // TODO: add uuid check
  assignmentId: z.string().uuid().optional(),
});

export const DiscussionCreateSchema = z.object({
  groupId: z.string().uuid(),
});

export type DiscussionFilterParams = z.infer<typeof DiscussionFilterSchema>;
export type DiscussionCreateParams = z.infer<typeof DiscussionCreateSchema>;
export type DiscussionDetail = Prisma.DiscussionGetPayload<{
  select: typeof discussionSelectDetail;
}>;
export type DiscussionShort = Prisma.DiscussionGetPayload<{ select: typeof discussionSelectShort }>;
