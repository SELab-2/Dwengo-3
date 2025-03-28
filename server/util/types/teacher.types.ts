import { z } from 'zod';

/**
 * Schema for creating a teacher
 *
 * @property userId - The id of the user to create the teacher for
 */
export const TeacherCreateSchema = z.object({
  userId: z.string().uuid(),
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
export const TeacherFilterSchema = z.object({
  userId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  assignmentId: z.string().uuid().optional(),
})
.refine((data) => Object.values(data).some((value) => value !== undefined), {
  message: 'At least one filter must be provided.',
  path: [],
});

export type TeacherFilterParams = z.infer<typeof TeacherFilterSchema>;

/**
 * Schema for including related entities when fetching teachers
 *
 * @property classes - Include the classes the teacher is in
 * @property assignments - Include the assignments the teacher is in
 * @property user - Include the user data of the teacher
 */
export const TeacherIncludeSchema = z.object({
  classes: z.boolean().optional(),
  assignments: z.boolean().optional(),
  user: z.boolean().optional(),
});

export type TeacherIncludeParams = z.infer<typeof TeacherIncludeSchema>;
