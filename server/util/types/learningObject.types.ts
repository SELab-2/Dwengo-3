import { z } from 'zod';
import { Uuid } from './assignment.types';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '.prisma/client';
import { learningObjectSelectShort, learningObjectSelectDetail } from '../selectInput/select';

export const ContentTypeEnum = z.enum([
  'TEXT_PLAIN',
  'TEXT_MARKDOWN',
  'IMAGE_IMAGE_BLOCK',
  'IMAGE_IMAGE',
  'AUDIO_MPEG',
  'APPLICATION_PDF',
  'EXTERN',
  'BLOCKLY',
]);

export const SubmissionTypeEnum = z.enum(['READ', 'MULTIPLE_CHOICE', 'FILE']);

export const learningObjectKeywordSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required'),
});

export type LearningObjectKeywordParams = z.infer<typeof learningObjectKeywordSchema>;

const multipleChoiceSchema = z
  .object({
    question: z.string().min(1, 'Question is required'),
    options: z.string().array().nonempty(),
    solution: z.string(),
  })
  .refine((data) => data.question.includes(data.solution), {
    message: 'The solution has to be in the options',
    path: [],
  });

export type MultipleChoice = z.infer<typeof multipleChoiceSchema>;

export const LearningObjectCreateSchema = z.object({
  hruid: z.string().min(1, 'HRUID is required'),
  uuid: z.string().uuid(),
  version: z.number().int().min(1, 'Version must be a positive integer'),
  language: z.string().min(1, 'Language is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  contentType: ContentTypeEnum.optional(),
  targetAges: z.array(z.number().int().nonnegative()).optional(),
  teacherExclusive: z.boolean().default(false),
  skosConcepts: z.array(z.string()).optional(),
  educationalGoals: z.array(z.any()).optional(), // JSON array
  copyright: z.string().optional(),
  licence: z.string().optional(),
  difficulty: z.number().optional(),
  estimatedTime: z.number().optional(),
  returnValue: z.any().optional(), // JSON object
  available: z.boolean().default(true),
  content: z.string().min(1, 'Content is required'),
  multipleChoice: multipleChoiceSchema.optional(), // JSON object
  submissionType: SubmissionTypeEnum.optional(),
  keywords: z.array(learningObjectKeywordSchema).optional(),
});

export type LearningObjectCreateParams = z.infer<typeof LearningObjectCreateSchema>;

export type LearningObjectWithoutKeywords = Omit<LearningObjectCreateParams, 'keywords'>;

export const LearningObjectUpdateSchema = z.object({
  version: z.number().int().min(1, 'Version must be a positive integer').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  contentType: ContentTypeEnum.optional(),
  targetAges: z.array(z.number().int().nonnegative()).optional(),
  teacherExclusive: z.boolean().optional(),
  skosConcepts: z.array(z.string()).optional(),
  educationalGoals: z.array(z.any()).optional(),
  copyright: z.string().optional(),
  licence: z.string().optional(),
  difficulty: z.number().optional(),
  estimatedTime: z.number().optional(),
  returnValue: z.any().optional(),
  available: z.boolean().optional(),
  content: z.string().min(1, 'Content is required').optional(),
  multipleChoice: z.any().optional(),
  learningObjectsKeywords: z.array(learningObjectKeywordSchema).optional(),
});

export type LearningObjectUpdateParams = z.infer<typeof LearningObjectUpdateSchema>;

export type LearningObjectUpdateWithoutKeywords = Omit<
  LearningObjectUpdateParams,
  'learningObjectsKeywords'
>;

export const LearningObjectFilterSchema = z.object({
  keywords: z.array(z.string()).optional(),
  targetAges: z
    .array(z.string())
    .transform((val) => val.map(Number))
    .optional(),
});

export type LearningObjectFilterParams = z.infer<typeof LearningObjectFilterSchema>;

export type LearningObjectShort = Prisma.LearningObjectGetPayload<{
  select: typeof learningObjectSelectShort;
}>;
export type LearningObjectDetail = Prisma.LearningObjectGetPayload<{
  select: typeof learningObjectSelectDetail;
}>;
