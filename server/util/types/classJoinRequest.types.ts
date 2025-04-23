import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { classJoinRequestSelectDetail } from '../selectInput/classJoinRequest.select';

export const ClassJoinRequestCreateScheme = z.object({
  classId: z.string().uuid('ClassId must be a valid UUID'),
});

export type ClassJoinRequestCreateParams = z.infer<
  typeof ClassJoinRequestCreateScheme
>;

export const ClassJoinRequestFilterSchema = z
  .object({
    classId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
  })
  .refine((data) => data.classId || data.userId, {
    message: 'At least one of classId or userId must be provided.',
    path: ['classId', 'userId'], // This will attach the error to both fields
  });

export type ClassJoinRequestFilterParams = z.infer<
  typeof ClassJoinRequestFilterSchema
>;

export const ClassJoinRequestDecisionSchema = z
  .object({
    requestId: z.string().uuid(),
    decision: z.enum(['accept', 'deny']),
  })
  .transform((data) => {
    return {
      requestId: data.requestId,
      acceptRequest: data.decision === 'accept',
    };
  });

export type ClassJoinRequestDecisionParams = z.infer<
  typeof ClassJoinRequestDecisionSchema
>;

export type ClassJoinRequestDetail = Prisma.ClassJoinRequestGetPayload<{select: typeof classJoinRequestSelectDetail}>;