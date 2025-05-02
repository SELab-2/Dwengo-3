import { z } from 'zod';
import { Prisma } from '.prisma/client';
import {
  assignmentSelectDetail,
  assignmentSelectShort,
  assignmentSelectShort2,
} from '../selectInput/select';

export const AssignmentFilterSchema = z
  .object({
    classId: z.string().uuid().optional(),
    groupId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one filter must be provided.',
    path: [],
  });

export const IdSchema = z.string().uuid();

export const AssignmentCreateSchema = z.object({
  groups: z.string().uuid().array().nonempty().array().nonempty(),
  classId: z.string().uuid(),
  teacherId: z.string().uuid().optional(),
  learningPathId: z.string(),
  deadline: z.string().datetime({ offset: true }),
});

export type AssignmentCreateParams = z.infer<typeof AssignmentCreateSchema>;
export type Uuid = z.infer<typeof IdSchema>;
export type AssignmentFilterParams = z.infer<typeof AssignmentFilterSchema>;

export type AssignmentDetail = Prisma.AssignmentGetPayload<{
  select: typeof assignmentSelectDetail;
}>;
export type AssignmentShort = Prisma.AssignmentGetPayload<{ select: typeof assignmentSelectShort }>;

export type AssignmentShort2 = Prisma.AssignmentGetPayload<{
  select: typeof assignmentSelectShort2;
}>;
