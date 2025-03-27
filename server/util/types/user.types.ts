import { z } from 'zod';
import { ClassRole, Student, Teacher, User } from '@prisma/client';
import { Uuid } from './assignment.types';

// Must be a different name than ClassRole to avoid conflicts/ confusion with prisma client ClassRole type.
export enum ClassRoleEnum {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

// Type for the persistence layer to represent a user including the student or teacher.
export type FullUserType = User & {
  student?: Student | null;
  teacher?: Teacher | null;
};

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

// do not return the password of the user to the client.
export type UserDto = Omit<UserEntity, 'password'>;
export type UserShort = {
  id: Uuid;
  surname: string;
  name: string;
  role: ClassRole;
};
