import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { classJoinRequestSelectDetail } from '../selectInput/select';
import {
  atLeastOneFieldProvided,
  ClassIdZod,
  RequestDecisionZod,
  RequestIdZod,
  UserIdZod,
} from './util_types';

export const ClassJoinRequestCreateScheme = z.object({
  classId: ClassIdZod,
});

export type ClassJoinRequestCreateParams = z.infer<typeof ClassJoinRequestCreateScheme>;

export const ClassJoinRequestFilterSchema = z
  .object({
    classId: ClassIdZod.optional(),
    userId: UserIdZod.optional(),
  })
  .refine(atLeastOneFieldProvided.validate, {
    message: atLeastOneFieldProvided.message,
  });

export type ClassJoinRequestFilterParams = z.infer<typeof ClassJoinRequestFilterSchema>;

export const ClassJoinRequestDecisionSchema = z
  .object({
    requestId: RequestIdZod,
    decision: RequestDecisionZod,
  })
  .transform((data) => {
    return {
      requestId: data.requestId,
      acceptRequest: data.decision === 'accept',
    };
  });

export type ClassJoinRequestDecisionParams = z.infer<typeof ClassJoinRequestDecisionSchema>;

export type ClassJoinRequestDetail = Prisma.ClassJoinRequestGetPayload<{
  select: typeof classJoinRequestSelectDetail;
}>;
