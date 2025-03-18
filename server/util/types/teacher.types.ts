import { z } from "zod";

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
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  assignmentId: z.string().uuid().optional(),
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

/**
 * Schema for updating a teacher
 *
 * @property id - The id of the teacher to update
 * @property classes - The classes the teacher needs to be added to
 * @property assignments - The assignments the teacher needs to be added to
 */
export const TeacherUpdateSchema = z.object({
  id: z.string().uuid(),
  classes: z.array(z.string().uuid()).optional(),
  assignments: z.array(z.string().uuid()).optional(),
});

export type TeacherUpdateParams = z.infer<typeof TeacherUpdateSchema>;

/**
 * Schema for deleting a teacher
 *
 * @property id - The id of the teacher to delete
 */
export const TeacherDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type TeacherDeleteParams = z.infer<typeof TeacherDeleteSchema>;
