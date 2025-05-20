import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { classSelectDetail, classSelectShort } from '../selectInput/select';
import {
  atLeastOneFieldProvided,
  DescriptionZod,
  NameZod,
  StudentIdZod,
  TeacherIdZod,
} from './util_types';

export const ClassFilterSchema = z
  .object({
    teacherId: TeacherIdZod.optional(),
    studentId: StudentIdZod.optional(),
  })
  .refine(atLeastOneFieldProvided.validate, {
    message: atLeastOneFieldProvided.message,
  });

export type ClassFilterParams = z.infer<typeof ClassFilterSchema>;

export const ClassCreateSchema = z.object({
  name: NameZod.optional(),
});

export type ClassCreateParams = z.infer<typeof ClassCreateSchema>;

export const ClassUpdateSchema = z.object({
  name: NameZod.optional(),
  description: DescriptionZod.optional(),
});

export type ClassUpdateParams = z.infer<typeof ClassUpdateSchema>;
export type ClassShort = Prisma.ClassGetPayload<{ select: typeof classSelectShort }>;
export type ClassDetail = Prisma.ClassGetPayload<{ select: typeof classSelectDetail }>;
