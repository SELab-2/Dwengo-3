import { z } from "zod";

// Must be a different name than ClassRole to avoid conflicts/ confusion with prisma client ClassRole type.
export enum ClassRoleEnum {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export const StudentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

export type StudentEntity = z.infer<typeof StudentSchema>;

export const TeacherSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

export type TeacherEntity = z.infer<typeof TeacherSchema>;

// an userSchema to not expose the User type from the prisma client to the domain / routes layer.
export const UserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  surname: z.string(),
  name: z.string(),
  role: z.enum([ClassRoleEnum.STUDENT, ClassRoleEnum.TEACHER]),
  id: z.string().uuid(),
  teacher: z.union([TeacherSchema, z.null()]).optional(), // Databse sets this to null if user is a student.
  student: z.union([StudentSchema, z.null()]).optional(), // Databse sets this to null if user is a teacher.
});

// Must be different name than User to avoid conflicts/ confusion with prisma client User type.
export type UserEntity = z.infer<typeof UserSchema>;
