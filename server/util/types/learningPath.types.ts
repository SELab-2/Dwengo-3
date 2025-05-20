import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { learningPathSelectDetail, learningPathSelectShort } from '../selectInput/select';
import {
  DescriptionZod,
  HruidZod,
  ImageZod,
  KeywordZod,
  LanguageZod,
  TitleZod,
} from './util_types';

export const LearningPathFilterSchema = z.object({
  keywords: z.array(KeywordZod).optional(),
  age: z
    .array(z.string())
    .transform((val) => val.map(Number))
    .optional(),
  searchTitle: z.string().optional(),
  searchKeyword: z.string().optional(),
});

export const LearningPathCreateSchema = z.object({
  hruid: HruidZod,
  language: LanguageZod,
  title: TitleZod,
  description: DescriptionZod.optional(),
  image: ImageZod.optional(),
});

export type LearningPathByFilterParams = z.infer<typeof LearningPathFilterSchema>;
export type LearningPathCreateParams = z.infer<typeof LearningPathCreateSchema>;

export type LearningPathShort = Prisma.LearningPathGetPayload<{
  select: typeof learningPathSelectShort;
}>;
export type LearningPathDetail = Prisma.LearningPathGetPayload<{
  select: typeof learningPathSelectDetail;
}>;
