import { z } from 'zod';

export const IdSchema = z.string().uuid();
export type Uuid = z.infer<typeof IdSchema>;

export type LearningThemeShort = {
  id: Uuid;
  image: string;
  title: string;
};

export type LearningThemeDetail = {
  id: Uuid;
  image: string;
  title: string;
  keywords: string[];
};

export const LearningThemeCreateSchema = z.object({
  image: z.string().url(),
  title: z.string(),
  keywords: z.array(z.string()),
});

export type LearningThemeCreateParams = z.infer<typeof LearningThemeCreateSchema>;
