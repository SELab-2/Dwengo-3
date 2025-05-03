import { z } from 'zod';
import { AuthenticationProvider, ClassRoleEnum } from './user.types';

export const RegisterSchema = z.object({
  id: z.string().uuid('invalid uuid format').optional(),
  username: z.string().nonempty(),
  email: z.string().email('invalid email'),
  password: z.string().nonempty(),
  surname: z.string().nonempty(),
  name: z.string().nonempty(),
  role: z.nativeEnum(ClassRoleEnum),
});

export const CreateUserSchema = z.object({
  id: z.string().uuid('invalid uuid format').optional(),
  username: z.string().nonempty(),
  provider: z.nativeEnum(AuthenticationProvider),
  email: z.string().email('invalid email'),
  password: z.string().nonempty(),
  surname: z.string().nonempty(),
  name: z.string().nonempty(),
  role: z.nativeEnum(ClassRoleEnum),
});

export type CreateUserParams = z.infer<typeof CreateUserSchema>;
export type RegisterParams = z.infer<typeof RegisterSchema>;
