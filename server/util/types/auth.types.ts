import { z } from 'zod';
import { ClassRole } from '@prisma/client';
import { AuthenticationProvider } from './user.types';

export const LoginSchema = z
  .object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  })
  .required();

export const RegisterSchema = z
  .object({
    id: z.string().optional(),
    username: z.string().nonempty(),
    provider: z.nativeEnum(AuthenticationProvider),
    email: z.string().email('invalid email'),
    password: z.string().nonempty(),
    surname: z.string().nonempty(),
    name: z.string().nonempty(),
    role: z.nativeEnum(ClassRole),
  })
  .required();

export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterCredentials = z.infer<typeof RegisterSchema>;
