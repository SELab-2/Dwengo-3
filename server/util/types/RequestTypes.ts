import { z } from 'zod';
import { ClassRole } from '@prisma/client';

export const LoginSchema = z
  .object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  })
  .required();

export const RegisterSchema = z
  .object({
    username: z.string().nonempty(),
    email: z.string().email('invalid email'),
    password: z.string().nonempty(),
    surname: z.string().nonempty(),
    name: z.string().nonempty(),
    role: z.nativeEnum(ClassRole),
  })
  .required();

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
