/*
 * This file contains all the atomic types used in other zod schemas to avoid code duplication.
 */

import { z, ZodObject } from 'zod';
import { Prisma } from '.prisma/client';

const MAX_TITLE_LENGTH = 255;
const MAX_CONTENT_LENGTH = 1000;
const MAX_DESCRIPTION_LENGTH = 1000;

export enum FilterType {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
  EQUAL = 'EQUAL',
}

export const ClassIdZod = z.string().uuid('Invalid class ID');

export const TeacherIdZod = z.string().uuid('Invalid teacher ID');
export const StudentIdZod = z.string().uuid('Invalid student ID');
export const GroupIdZod = z.string().uuid('Invalid group ID');
export const LearningPathIdZod = z.string();

export const TimestampZod = z.coerce.number({ invalid_type_error: 'Timestamp must be a number' });
export const TimestampFilterTypeZod = z.nativeEnum(FilterType, {
  invalid_type_error: 'Invalid filter type',
});

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
