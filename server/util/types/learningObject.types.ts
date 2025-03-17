import { z } from "zod";

export const ContentTypeEnum = z.enum([
  "TEXT_PLAIN",
  "TEXT_MARKDOWN",
  "IMAGE_IMAGE_BLOCK",
  "IMAGE_IMAGE",
  "AUDIO_MPEG",
  "APPLICATION_PDF",
  "EXTERN",
  "BLOCKLY",
]);

export const learningObjectKeywordSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
});

export type LearningObjectKeywordParams = z.infer<
  typeof learningObjectKeywordSchema
>;

export const LearningObjectCreateSchema = z.object({
  hruid: z.string().min(1, "HRUID is required"),
  uuid: z.string().uuid(),
  version: z.number().int().min(1, "Version must be a positive integer"),
  language: z.string().min(1, "Language is required"),
  title: z.string().min(1, "Title is required"),
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
  content: z.string().min(1, "Content is required"),
  multipleChoice: z.any().optional(), // JSON object
  canUploadSubmission: z.boolean().default(false),
  keywords: z.array(learningObjectKeywordSchema).optional(),
});

export type LearningObjectCreateParams = z.infer<
  typeof LearningObjectCreateSchema
>;

export type LearningObjectWithoutKeywords = Omit<
  LearningObjectCreateParams,
  "keywords"
>;

export const LearningObjectUpdateSchema = z.object({
  version: z
    .number()
    .int()
    .min(1, "Version must be a positive integer")
    .optional(),
  title: z.string().min(1, "Title is required").optional(),
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
  content: z.string().min(1, "Content is required").optional(),
  multipleChoice: z.any().optional(),
  canUploadSubmission: z.boolean().optional(),
  learningObjectsKeywords: z.array(learningObjectKeywordSchema).optional(),
});

export type LearningObjectUpdateParams = z.infer<
  typeof LearningObjectUpdateSchema
>;

export type LearningObjectUpdateWithoutKeywords = Omit<
  LearningObjectUpdateParams,
  "learningObjectsKeywords"
>;

export const LearningObjectFilterSchema = z.object({
  keywords: z.array(z.string()).optional(),
  targetAges: z
    .array(z.string())
    .transform((val) => val.map(Number))
    .optional(),
});

export type LearningObjectFilterParams = z.infer<
  typeof LearningObjectFilterSchema
>;
