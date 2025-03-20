import { Request } from 'express';
import crypto from 'crypto';
import { LoginRequest, RegisterRequest } from '../util/types/RequestTypes';
import * as persistence from '../persistence/auth/users.persistance';
import { AuthProvider, ClassRole, User } from '@prisma/client';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  FullUserType,
  UserEntity,
} from '../util/types/user.types';

/**
 * Maps the `AuthProvider` enum from the prisma client to the
 * `AuthenticationProvider` enum from the types layer.
 *
 * @throws {Error} If the provider is not recognized.
 *
 * @param {AuthProvider} provider The provider from the prisma client.
 * @returns {AuthenticationProvider} The provider from the types layer.
 */
function fromAuthProvider(provider: AuthProvider): AuthenticationProvider {
  switch (provider) {
    case AuthProvider.LOCAL:
      return AuthenticationProvider.LOCAL;
    case AuthProvider.GOOGLE:
      return AuthenticationProvider.GOOGLE;
    default:
      throw new Error('Invalid provider');
  }
}

export async function registerUser(
  registerRequest: RegisterRequest,
): Promise<UserEntity> {
  const user = await persistence.saveUser({
    username: registerRequest.username,
    email: registerRequest.email,
    provider: registerRequest.provider,
    password: crypto
      .createHash('sha512')
      .update(registerRequest.password)
      .digest('base64'),
    name: registerRequest.name,
    surname: registerRequest.surname,
    role: registerRequest.role as ClassRole,
  });
  return {
    id: user.id,
    provider: fromAuthProvider(user.provider),
    username: user.username,
    email: user.email,
    password: user.password,
    name: user.name,
    surname: user.surname,
    role:
      user.role === ClassRole.TEACHER
        ? ClassRoleEnum.TEACHER
        : ClassRoleEnum.STUDENT,
    teacher: user.teacher,
    student: user.student,
  };
}

export async function loginUser(
  loginRequest: LoginRequest,
): Promise<UserEntity> {
  const user: FullUserType | null = await persistence.getUserByEmail(
    loginRequest.email,
  );
  if (user === null) throw new Error('User not found');
  return {
    id: user.id,
    provider: fromAuthProvider(user.provider),
    username: user.username,
    email: user.email,
    password: user.password,
    name: user.name,
    surname: user.surname,
    role:
      user.role === ClassRole.TEACHER
        ? ClassRoleEnum.TEACHER
        : ClassRoleEnum.STUDENT,
    teacher: user.teacher,
    student: user.student,
  };
}

/**
 * Fetches a user by their ID.
 *
 * @param id - The ID of the user to fetch.
 * @returns The user data. If the user is not found, null is returned.
 */
export async function getUserById(id: string): Promise<FullUserType | null> {
  return await persistence.getUserById(id);
}

export async function deleteUser(id: string): Promise<boolean> {
  const user: User | null = await persistence.deleteUser(id);
  return user !== null;
}

export async function getUserFromReq(req: Request): Promise<UserEntity> {
  // todo: rewrite with new cookie format using express-session
  throw new Error('Not implemented yet.');
}
