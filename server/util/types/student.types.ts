import { z } from 'zod';
import { atLeastOneFieldProvided, ClassIdZod, GroupIdZod, UserIdZod } from './util_types';

/**
 * Schema for creating a student
 *
 * @property userId - The id of the user to create the student for
 */
export const StudentCreateSchema = z.object({
  userId: UserIdZod,
});

export type StudentCreateParams = z.infer<typeof StudentCreateSchema>;

/**
 * Schema for filtering students
 *
 * @property id - The id of the student to get
 * @property userId - The id of the user to get the student for
 * @property classId - The id the class to get all students from
 * @property groupId - The id the group to get all students from
 */
export const StudentFilterSchema = z
  .object({
    userId: UserIdZod.optional(),
    classId: ClassIdZod.optional(),
    groupId: GroupIdZod.optional(),
  })
  .refine(atLeastOneFieldProvided.validate, {
    message: atLeastOneFieldProvided.message,
  });

export type StudentFilterParams = z.infer<typeof StudentFilterSchema>;
