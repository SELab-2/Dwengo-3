import { z } from 'zod';
import {
  AuthenticationProviderZod,
  ClassRoleZod,
  EmailZod,
  NameZod,
  PasswordZod,
  SurnameZod,
  UserNameZod,
} from './util_types';

export const RegisterSchema = z.object({
  username: UserNameZod,
  email: EmailZod,
  password: PasswordZod,
  surname: SurnameZod,
  name: NameZod,
  role: ClassRoleZod,
});

export const CreateUserSchema = z.object({
  username: UserNameZod,
  provider: AuthenticationProviderZod,
  email: EmailZod,
  password: PasswordZod,
  surname: SurnameZod,
  name: NameZod,
  role: ClassRoleZod,
});

export type CreateUserParams = z.infer<typeof CreateUserSchema>;
export type RegisterParams = z.infer<typeof RegisterSchema>;
