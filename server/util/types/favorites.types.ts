import { TypeOf, z } from 'zod';

export const FavoriteFilterSchema = z.object({
  userId: z.string().uuid(),
});

export const FavoriteCreateSchema = z.object({
  learningPathId: z.string().uuid(),
});

export type FavoriteFilterParams = z.infer<typeof FavoriteFilterSchema>;
export type FavoriteCreateParams = z.infer<typeof FavoriteCreateSchema>;
