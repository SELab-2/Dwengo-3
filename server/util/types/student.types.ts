import { z } from 'zod';

/**
 * Schema for creating a student
 *
 * @property userId - The id of the user to create the student for
 */
export const StudentCreateSchema = z.object({
  userId: z.string().uuid(),
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
    userId: z.string().uuid().optional(),
    classId: z.string().uuid().optional(),
    groupId: z.string().uuid().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one filter must be provided.',
    path: [],
  });

export type StudentFilterParams = z.infer<typeof StudentFilterSchema>;

/**
 * Schema for including related entities when fetching students
 *
 * @property classes - Include the classes the student is in
 * @property groups - Include the groups the student is in
 * @property user - Include the user data of the student
 */
export const StudentIncludeSchema = z.object({
  classes: z.boolean().optional(),
  groups: z.boolean().optional(),
  user: z.boolean().optional(),
});

export type StudentIncludeParams = z.infer<typeof StudentIncludeSchema>;
