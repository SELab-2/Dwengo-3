import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { discussionSelectDetail, discussionSelectShort } from '../selectInput/select';
import { AssignmentIdZod, GroupIdZod, UserIdZod } from './util_types';

export const DiscussionFilterSchema = z.object({
  userId: UserIdZod.optional(),
  assignmentId: AssignmentIdZod.optional(),
});

export const DiscussionCreateSchema = z.object({
  groupId: GroupIdZod,
});

export type DiscussionFilterParams = z.infer<typeof DiscussionFilterSchema>;
export type DiscussionCreateParams = z.infer<typeof DiscussionCreateSchema>;
export type DiscussionDetail = Prisma.DiscussionGetPayload<{
  select: typeof discussionSelectDetail;
}>;
export type DiscussionShort = Prisma.DiscussionGetPayload<{ select: typeof discussionSelectShort }>;
