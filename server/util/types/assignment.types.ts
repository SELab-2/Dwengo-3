import { z } from 'zod';
import { Prisma } from '@prisma/client';
import {
  assignmentSelectDetail,
  assignmentSelectShort,
  assignmentSelectShort2,
} from '../selectInput/select';
import {
  atLeastOneFieldProvided,
  ClassIdZod,
  DeadlineZod,
  DescriptionZod,
  GroupIdZod,
  LearningPathIdZod,
  StudentIdZod,
  TeacherIdZod,
  TitleZod,
} from './util_types';

export const AssignmentFilterSchema = z
  .object({
    classId: ClassIdZod.optional(),
    groupId: GroupIdZod.optional(),
    teacherId: TeacherIdZod.optional(),
    studentId: StudentIdZod.optional(),
  })
  .refine(atLeastOneFieldProvided.validate, {
    message: atLeastOneFieldProvided.message,
  });

export const AssignmentCreateSchema = z.object({
  name: TitleZod,
  description: DescriptionZod,
  groups: GroupIdZod.array().nonempty().array().nonempty(),
  classId: ClassIdZod,
  teacherId: TeacherIdZod.optional(),
  learningPathId: LearningPathIdZod,
  deadline: DeadlineZod,
});

export type AssignmentCreateParams = z.infer<typeof AssignmentCreateSchema>;
export type AssignmentFilterParams = z.infer<typeof AssignmentFilterSchema>;

export type AssignmentDetail = Prisma.AssignmentGetPayload<{
  select: typeof assignmentSelectDetail;
}>;
export type AssignmentShort = Prisma.AssignmentGetPayload<{ select: typeof assignmentSelectShort }>;

export type AssignmentShort2 = Prisma.AssignmentGetPayload<{
  select: typeof assignmentSelectShort2;
}>;
