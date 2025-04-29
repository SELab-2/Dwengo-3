import { z } from 'zod';
import { Uuid } from './assignment.types';
import { Prisma } from '.prisma/client';
import { learningPathSelectShort, learningPathSelectDetail } from '../selectInput/select';

export const LearningPathFilterSchema = z.object({
  keywords: z.array(z.string()).optional(),
  age: z
    .array(z.string())
    .transform((val) => val.map(Number))
    .optional(),
});

export const LearningPathCreateSchema = z.object({
  hruid: z.string(),
  language: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type LearningPathByFilterParams = z.infer<typeof LearningPathFilterSchema>;
export type LearningPathCreateParams = z.infer<typeof LearningPathCreateSchema>;

export type LearningPathShort = Prisma.LearningPathGetPayload<{
  select: typeof learningPathSelectShort;
}>;
export type LearningPathDetail = Prisma.LearningPathGetPayload<{
  select: typeof learningPathSelectDetail;
}>;
