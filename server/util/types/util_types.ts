/*
 * This file contains all the atomic types used in other zod schemas to avoid code duplication.
 */

import { z } from 'zod';
import { SubmissionType } from '@prisma/client';
import { AuthenticationProvider, ClassRoleEnum, ContentTypeEnum, FilterType } from './enums.types';

const MAX_TITLE_LENGTH = 255;
const MAX_CONTENT_LENGTH = 1000;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_FILENAME_LENGTH = 255;
const MAX_FILEPATH_LENGTH = 255;

/* To define custom error message for the following 3 zod types, we need to use the `refine` method
 * simply because zod does not support custom error messages for schemas like the following:
 * z.string().uuid('Invalid UUID').or(z.string().regex(/^[0-9a-z]+$/))
 * If both schemas fail, an generic error message would be returned.
 * Therefor, we test if it is parsed successfully to one of the two schemas and return a custom error message.
 */
export const LearningPathIdZod = z.string().refine(
  (value) => {
    return UuidZod.safeParse(value).success || UuidRegexZod.safeParse(value).success;
  },
  {
    message: 'Invalid learning path ID',
  },
);

export const LearningObjectIdZod = z.string().refine(
  (value) => {
    return UuidZod.safeParse(value).success || UuidRegexZod.safeParse(value).success;
  },
  {
    message: 'Invalid learning path ID',
  },
);

export const NodeIdZod = z.string().refine(
  (value) => {
    return UuidZod.safeParse(value).success || UuidRegexZod.safeParse(value).success;
  },
  {
    message: 'Invalid node ID',
  },
);

const UuidRegexZod = z.string().regex(/^[0-9a-z]+$/);
export const ClassIdZod = z.string().uuid('Invalid class ID');
export const TeacherIdZod = z.string().uuid('Invalid teacher ID');
export const StudentIdZod = z.string().uuid('Invalid student ID');
export const GroupIdZod = z.string().uuid('Invalid group ID');
export const FavoriteIdZod = z.string().uuid('Invalid favorite ID');
export const UserIdZod = z.string().uuid('Invalid user ID');
export const RequestIdZod = z.string().uuid('Invalid request ID');
export const AssignmentIdZod = z.string().uuid('Invalid assignment ID');
export const HruidZod = z.string().trim().nonempty('HRUID must be a non-empty string');
export const UuidZod = z.string().uuid('Invalid UUID');
export const DiscussionIdZod = z.string().uuid('Invalid discussion ID');
export const MessageIdZod = z.number().int().positive('Invalid message ID');
export const LearningThemeIdZod = z.string().uuid('Invalid learning theme ID');

export const RequestDecisionZod = z.enum(['accept', 'deny'], {
  invalid_type_error: 'Invalid request decision',
});

export const ConditionZod = z.string().trim().nonempty('Condition must be a non-empty string');
export const LanguageZod = z.string().trim().nonempty('Language must be a non-empty string');
export const VersionZod = z.number().int().min(1, 'Version must be a positive integer');
export const IndexZod = z.number().int().min(0, 'Index must be a non-negative integer');
export const ImageZod = z.string().nonempty('Image must be a non-empty string');
export const UserNameZod = z.string().trim().nonempty('Username must be a non-empty string');
export const EmailZod = z.string().email('Invalid email format').trim();
export const PasswordZod = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .trim(); /* TODO might add further requirements, like special characters */
export const InstructionZod = z.string().trim().nonempty('Instruction must be a non-empty string');
export const SurnameZod = z.string().trim().nonempty('Surname must be a non-empty string');
export const NameZod = z.string().trim().nonempty('Name must be a non-empty string');
export const TargetAgeZod = z
  .number()
  .int()
  .nonnegative('Target age must be a non-negative integer');

export const TeacherExclusiveZod = z
  .boolean({ invalid_type_error: 'teacherExclusive must be a boolean' })
  .default(false);

export const KeywordZod = z.string().trim().min(1, 'Keyword must be a non-empty string');
export const QuestionZod = z.string().trim().min(1, 'Question must be a non-empty string');
export const AnswerOptionZod = z.string().trim().min(1, 'Answer option must be a non-empty string');
export const SolutionZod = z.string().trim().min(1, 'Solution must be a non-empty string');

export const TimestampZod = z.coerce.number({ invalid_type_error: 'Timestamp must be a number' });
export const TimestampFilterTypeZod = z.nativeEnum(FilterType, {
  invalid_type_error: 'Invalid filter type',
});

export const SkosConceptZod = z.string();
export const EducationalGoalZod = z.any();
export const CopyRightZod = z.string().optional();
export const LicenceZod = z.string().optional();
export const DifficultyZod = z
  .number()
  .int()
  .min(1, 'Difficulty must be a positive integer')
  .max(5, 'Difficulty must be at most 5');

export const ClassRoleZod = z.nativeEnum(ClassRoleEnum, {
  invalid_type_error: 'Invalid class role',
});

export const ReturnValueZod = z.any();

export const AvailableZod = z
  .boolean({
    invalid_type_error: 'Available must be a boolean',
  })
  .default(true);

export const EstimatedTimeZod = z
  .number()
  .int()
  .min(0, 'Estimated time must be a non-negative integer');

export const TitleZod = z
  .string()
  .min(1, 'Title must be a non-empty string')
  .trim()
  .max(MAX_TITLE_LENGTH, 'Title is too long');

export const ContentZod = z
  .string()
  .min(1, 'Content must be a non-empty string')
  .trim()
  .max(MAX_CONTENT_LENGTH, 'Content is too long');

export const atLeastOneFieldProvided = {
  validate: (data: Record<string, any>) => Object.values(data).some((value) => value !== undefined),
  message: 'At least one field must be provided.',
};

export const DescriptionZod = z
  .string()
  .min(0)
  .max(MAX_DESCRIPTION_LENGTH, 'description is too long');

export const DeadlineZod = z
  .string()
  .datetime({ offset: true })
  .refine((value) => new Date(value) > new Date(), {
    message: 'Deadline must be a future date.',
  });

export const FileNameZod = z
  .string()
  .min(1, 'File name must be a non-empty string')
  .max(MAX_FILENAME_LENGTH, 'filename is too long')
  .trim();

export const FilePathZod = z
  .string()
  .min(1, 'File path must be a non-empty string')
  .max(MAX_FILEPATH_LENGTH, 'filepath is too long')
  .trim();

export const AnswerZod = z.string().min(1, 'Answer must be a non-empty string').trim();

export const SubmissionTypeZod = z.nativeEnum(SubmissionType, {
  invalid_type_error: 'Invalid submission type',
});

export const AuthenticationProviderZod = z.nativeEnum(AuthenticationProvider, {
  invalid_type_error: 'Invalid authentication provider',
});

export type UuId = z.infer<typeof UuidZod>;
export type MessageId = z.infer<typeof MessageIdZod>;

export const ContentTypeEnumZod = z.nativeEnum(ContentTypeEnum, {
  invalid_type_error: 'Invalid content type',
});
