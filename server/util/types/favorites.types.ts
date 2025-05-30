import { z } from 'zod';
import { LearningPathIdZod, UserIdZod } from './util_types';

export const FavoriteFilterSchema = z.object({
  userId: UserIdZod,
  learningPathId: LearningPathIdZod.optional(),
});

export const FavoriteCreateSchema = z.object({
  learningPathId: LearningPathIdZod,
});

export type FavoriteFilterParams = z.infer<typeof FavoriteFilterSchema>;
export type FavoriteCreateParams = z.infer<typeof FavoriteCreateSchema>;
