import { Request } from 'express';
import { LoginCredentials, RegisterCredentials } from '../util/types/auth.types';
import * as persistence from '../persistence/auth/users.persistance';
import { AuthProvider, User, ClassRole } from '@prisma/client';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  FullUserType,
  UserEntity,
} from '../util/types/user.types';
import * as crypto from 'node:crypto';

const providerMap = {
  [AuthProvider.GOOGLE]: AuthenticationProvider.GOOGLE,
  [AuthProvider.LOCAL]: AuthenticationProvider.LOCAL,
};

const roleMap = {
  [ClassRole.TEACHER]: ClassRoleEnum.TEACHER,
  [ClassRole.STUDENT]: ClassRoleEnum.STUDENT,
};

export async function createUser(userData: RegisterCredentials): Promise<UserEntity> {
  if (userData.provider === AuthenticationProvider.LOCAL) {
    userData.password = crypto.createHash('sha256').update(userData.password).digest('base64');
  }

  const user = await persistence.saveUser(userData);
  return {
    email: user.email,
    id: user.id,
    name: user.name,
    password: user.password,
    provider: providerMap[user.provider],
    role: roleMap[user.role],
    student: user.student,
    surname: user.surname,
    teacher: user.teacher,
    username: user.username,
  };
}

/**
 * Fetches a user by their ID.
 *
 * @param id - The ID of the user to fetch.
 * @returns The user data. If the user is not found, null is returned.
 */
export async function getUserById(id: string): Promise<UserEntity | null> {
  const user = await persistence.getUserById(id);
  if (user === null) return null;
  return {
    id: user.id,
    provider: providerMap[user.provider],
    username: user.username,
    email: user.email,
    password: user.password,
    name: user.name,
    surname: user.surname,
    role: roleMap[user.role],
    teacher: user.teacher,
    student: user.student,
  };
}

/**
 * Deletes a user by their ID.
 *
 * @param id - The ID of the user to delete.
 *
 * @returns `true` if the user was successfully deleted, `false` otherwise.
 */
export async function deleteUser(id: string): Promise<boolean> {
  const user: User | null = await persistence.deleteUser(id);
  return user !== null;
}

/**
 * Extracts the authenticated user from the request object.
 *
 * @param req - The Express request object containing the user information.
 * @returns The authenticated user as a UserEntity.
 * @throws If the user is not authenticated or the user data is malformed.
 */
export function getUserFromReq(req: Request): UserEntity {
  return req.user!! as UserEntity;
}

/**
 * Fetches a user by their email address.
 *
 * @param email - The email address to search for.
 * @returns The user data if the user is found, otherwise null.
 */
export async function getUserByEmail(email: string): Promise<UserEntity | null> {
  const user = await persistence.getUserByEmail(email);
  if (user === null) return null;
  return {
    id: user.id,
    provider: providerMap[user.provider],
    username: user.username,
    email: user.email,
    password: user.password,
    name: user.name,
    surname: user.surname,
    role: roleMap[user.role],
    teacher: user.teacher,
    student: user.student,
  };
}
