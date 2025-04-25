import { z } from 'zod';
import { ClassRole, Prisma, Student, Teacher, User } from '@prisma/client';
import { userSelectShort } from '../selectInput/user.select';

// Must be a different name than ClassRole to avoid conflicts/ confusion with prisma client ClassRole type.
export enum ClassRoleEnum {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum AuthenticationProvider {
  GOOGLE = 'GOOGLE',
  LOCAL = 'LOCAL',
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
  provider: z.enum([AuthenticationProvider.GOOGLE, AuthenticationProvider.LOCAL]),
  email: z.string().email(),
  password: z.string(),
  surname: z.string(),
  name: z.string(),
  role: z.enum([ClassRole.STUDENT, ClassRole.TEACHER]),
  id: z.string().uuid(),
  teacher: z.union([TeacherSchema, z.null()]).optional(), // Database sets this to null if user is a student.
  student: z.union([StudentSchema, z.null()]).optional(), // Database sets this to null if user is a teacher.
});

// Must be different name than User to avoid conflicts/ confusion with prisma client User type.
export type UserEntity = z.infer<typeof UserSchema>;

// do not return the password of the user to the client.
export type UserDto = Omit<UserEntity, 'password'>;
export type UserShort = Prisma.UserGetPayload<{ select: typeof userSelectShort }>;
