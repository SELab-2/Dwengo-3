import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { discussionSelectDetail, discussionSelectShort } from '../selectInput/discussion.select';

export const DiscussionFilterSchema = z
  .object({
    userId: z.string().uuid().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one filter must be provided.',
    path: [],
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
