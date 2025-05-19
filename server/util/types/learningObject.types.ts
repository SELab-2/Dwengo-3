import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { learningObjectSelectShort, learningObjectSelectDetail } from '../selectInput/select';
import {
  AnswerOptionZod,
  AvailableZod,
  ContentTypeEnumZod,
  ContentZod,
  CopyRightZod,
  DescriptionZod,
  DifficultyZod,
  EducationalGoalZod,
  EstimatedTimeZod,
  HruidZod,
  KeywordZod,
  LanguageZod,
  LicenceZod,
  QuestionZod,
  ReturnValueZod,
  SkosConceptZod,
  SolutionZod,
  SubmissionTypeZod,
  TargetAgeZod,
  TeacherExclusiveZod,
  TitleZod,
  UuidZod,
  VersionZod,
} from './util_types';

// export const ContentTypeEnum = z.enum([
//   'TEXT_PLAIN',
//   'TEXT_MARKDOWN',
//   'IMAGE_IMAGE_BLOCK',
//   'IMAGE_IMAGE',
//   'AUDIO_MPEG',
//   'APPLICATION_PDF',
//   'EXTERN',
//   'BLOCKLY',
// ]);

// export const SubmissionTypeEnum = z.enum(['READ', 'MULTIPLE_CHOICE', 'FILE']);

export const learningObjectKeywordSchema = z.object({
  keyword: KeywordZod,
});

export type LearningObjectKeywordParams = z.infer<typeof learningObjectKeywordSchema>;

const multipleChoiceSchema = z
  .object({
    question: QuestionZod,
    options: AnswerOptionZod.array().nonempty(),
    solution: SolutionZod,
  })
  .refine((data) => data.question.includes(data.solution), {
    message: 'The options have to contain the solution',
  });

export type MultipleChoice = z.infer<typeof multipleChoiceSchema>;

export const LearningObjectCreateSchema = z.object({
  hruid: HruidZod,
  uuid: UuidZod,
  version: VersionZod,
  language: LanguageZod,
  title: TitleZod,
  description: DescriptionZod.optional(),
  contentType: ContentTypeEnumZod.optional(),
  targetAges: z.array(TargetAgeZod).optional(),
  teacherExclusive: TeacherExclusiveZod,
  skosConcepts: z.array(SkosConceptZod).optional(),
  educationalGoals: z.array(EducationalGoalZod).optional(), // JSON array
  copyright: CopyRightZod,
  licence: LicenceZod.optional(),
  difficulty: DifficultyZod.optional(),
  estimatedTime: EstimatedTimeZod.optional(),
  returnValue: ReturnValueZod.optional(), // JSON object
  available: AvailableZod,
  content: ContentZod,
  multipleChoice: multipleChoiceSchema.optional(), // JSON object
  submissionType: SubmissionTypeZod.optional(),
  keywords: z.array(learningObjectKeywordSchema).nonempty().optional(),
});

export type LearningObjectCreateParams = z.infer<typeof LearningObjectCreateSchema>;

export type LearningObjectWithoutKeywords = Omit<LearningObjectCreateParams, 'keywords'>;

export const LearningObjectUpdateSchema = z.object({
  version: VersionZod.optional(),
  title: TitleZod.optional(),
  description: DescriptionZod.optional(),
  contentType: ContentTypeEnumZod.optional(),
  targetAges: z.array(TargetAgeZod).optional(),
  teacherExclusive: TeacherExclusiveZod.optional(),
  skosConcepts: z.array(SkosConceptZod).optional(),
  educationalGoals: z.array(EducationalGoalZod).optional(),
  copyright: CopyRightZod.optional(),
  licence: LicenceZod.optional(),
  difficulty: DifficultyZod.optional(),
  estimatedTime: EstimatedTimeZod.optional(),
  returnValue: ReturnValueZod.optional(),
  available: AvailableZod.optional(),
  content: ContentZod.optional(),
  multipleChoice: multipleChoiceSchema.optional(),
  keywords: z.array(learningObjectKeywordSchema).optional(),
});

export type LearningObjectUpdateParams = z.infer<typeof LearningObjectUpdateSchema>;

export type LearningObjectUpdateWithoutKeywords = Omit<LearningObjectUpdateParams, 'keywords'>;

export const LearningObjectFilterSchema = z.object({
  keywords: z.array(KeywordZod).optional(),
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
