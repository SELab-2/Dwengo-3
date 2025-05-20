import { z } from 'zod';
import { AssignmentIdZod, atLeastOneFieldProvided, ClassIdZod, UserIdZod } from './util_types';

/**
 * Schema for creating a teacher
 *
 * @property userId - The id of the user to create the teacher for
 */
export const TeacherCreateSchema = z.object({
  userId: UserIdZod,
});

export type TeacherCreateParams = z.infer<typeof TeacherCreateSchema>;

/**
 * Schema for filtering teachers
 *
 * @property id - The id of the teacher to get
 * @property userId - The id of the user to get the teacher for
 * @property classId - The id of the class to get all teachers from
 * @property assignmentId - The id of the assignment to get the teacher for
 */
export const TeacherFilterSchema = z
  .object({
    userId: UserIdZod.optional(),
    classId: ClassIdZod.optional(),
    assignmentId: AssignmentIdZod.optional(),
  })
  .refine(atLeastOneFieldProvided.validate, {
    message: atLeastOneFieldProvided.message,
  });

export type TeacherFilterParams = z.infer<typeof TeacherFilterSchema>;
