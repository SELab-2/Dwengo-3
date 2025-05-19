import { z } from 'zod';
import { ImageZod, KeywordZod, LearningThemeIdZod, TitleZod } from './util_types';

export const IdSchema = z.string().uuid();
export type Uuid = z.infer<typeof IdSchema>;

export type LearningThemeShort = {
  id: z.infer<typeof LearningThemeIdZod>;
  image: z.infer<typeof ImageZod>;
  title: z.infer<typeof TitleZod>;
};

export type LearningThemeDetail = {
  id: z.infer<typeof LearningThemeIdZod>;
  image: z.infer<typeof ImageZod>;
  title: z.infer<typeof TitleZod>;
  keywords: z.infer<typeof KeywordZod>[];
};

export const LearningThemeCreateSchema = z.object({
  image: ImageZod,
  title: TitleZod,
  keywords: z.array(KeywordZod),
});

export type LearningThemeCreateParams = z.infer<typeof LearningThemeCreateSchema>;
