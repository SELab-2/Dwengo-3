import { Request } from 'express';
import { RegisterParams } from '../util/types/auth.types';
import { AuthProvider, ClassRole, User } from '@prisma/client';
import { AuthenticationProvider, ClassRoleEnum, UserEntity } from '../util/types/user.types';
import * as crypto from 'node:crypto';
import { BadRequestError } from '../util/types/error.types';
import { UsersPersistence } from '../persistence/auth/users.persistence';
import { ClassFilterParams, ClassShort } from '../util/types/class.types';
import { ClassDomain } from './class.domain';

export class UserDomain {
  private readonly providerMap = {
    [AuthProvider.GOOGLE]: AuthenticationProvider.GOOGLE,
    [AuthProvider.LOCAL]: AuthenticationProvider.LOCAL,
  };

  private readonly roleMap = {
    [ClassRole.TEACHER]: ClassRoleEnum.TEACHER,
    [ClassRole.STUDENT]: ClassRoleEnum.STUDENT,
  };

  private readonly persistence = new UsersPersistence();
  private readonly classDomain = new ClassDomain();

  async createUser(userData: RegisterParams): Promise<UserEntity> {
    if ((await this.persistence.getUserByEmail(userData.email)) !== null) {
      throw new BadRequestError(-1, 'User already exists');
    }

    if (userData.provider === AuthenticationProvider.LOCAL) {
      userData.password = crypto.createHash('sha256').update(userData.password).digest('base64');
    }

    const user = await this.persistence.saveUser(userData);
    return {
      email: user.email,
      id: user.id,
      name: user.name,
      password: user.password,
      provider: this.providerMap[user.provider],
      role: this.roleMap[user.role],
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
  async getUserById(id: string): Promise<UserEntity | null> {
    const user = await this.persistence.getUserById(id);
    if (user === null) return null;
    return {
      id: user.id,
      provider: this.providerMap[user.provider],
      username: user.username,
      email: user.email,
      password: user.password,
      name: user.name,
      surname: user.surname,
      role: this.roleMap[user.role],
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
  async deleteUser(id: string): Promise<boolean> {
    const user: User | null = await this.persistence.deleteUser(id);
    return user !== null;
  }

  /**
   * Extracts the authenticated user from the request object.
   *
   * @param req - The Express request object containing the user information.
   * @returns The authenticated user as a UserEntity.
   * @throws If the user is not authenticated or the user data is malformed.
   */
  async getUserFromReq(req: Request): Promise<UserEntity & { classes: ClassShort[] }> {
    const filter: ClassFilterParams = {
      teacherId: (req.user as UserEntity).teacher?.id,
      studentId: (req.user as UserEntity).student?.id,
    };

    const classes = await this.classDomain.getClasses(filter, req.user!! as UserEntity);
    const user = {
      ...(req.user as UserEntity),
      classes: classes.data,
    };

    console.debug(user);

    return user;
  }

  /**
   * Fetches a user by their email address.
   *
   * @param email - The email address to search for.
   * @returns The user data if the user is found, otherwise null.
   */
  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.persistence.getUserByEmail(email);
    if (user === null) return null;
    return {
      id: user.id,
      provider: this.providerMap[user.provider],
      username: user.username,
      email: user.email,
      password: user.password,
      name: user.name,
      surname: user.surname,
      role: this.roleMap[user.role],
      teacher: user.teacher,
      student: user.student,
    };
  }
}
