import { z } from 'zod';

export const FavoriteFilterSchema = z.object({
  userId: z.string().uuid(),
  learningPathId: z.string().optional(),
});

export const FavoriteCreateSchema = z.object({
  learningPathId: z.string(),
});

export type FavoriteFilterParams = z.infer<typeof FavoriteFilterSchema>;
export type FavoriteCreateParams = z.infer<typeof FavoriteCreateSchema>;
