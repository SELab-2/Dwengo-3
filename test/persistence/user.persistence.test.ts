import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { ClassRoleEnum, FullUserType, UserEntity } from '../../server/util/types/user.types';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';
import { deleteAllData, insertUsers } from './testData';
import { UsersPersistence } from '../../server/persistence/auth/users.persistence';

let users: FullUserType[] = [];
const usersPersistence: UsersPersistence = new UsersPersistence();

describe('user persistence test', () => {
  beforeAll(async () => {
    users = await insertUsers();
  });

  afterAll(async () => {
    await deleteAllData();
    const count = PrismaSingleton.instance.user.count();
    expect(count).resolves.toBe(0);
    await PrismaSingleton.instance.$disconnect();
  });

  describe('get user by email', () => {
    test('request with existing email responds correctly', async () => {
      for (const user of users) {
        const req = usersPersistence.getUserByEmail(user.email);
        let expectedUser;
        if (user.role === ClassRoleEnum.STUDENT) {
          expectedUser = { ...user, teacher: null };
        } else {
          expectedUser = { ...user, student: null };
        }
        await expect(req).resolves.toStrictEqual(expectedUser);
      }
    });
  });

  describe('get user by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const user of users) {
        const req = usersPersistence.getUserById(user.id);
        let expectedUser;
        if (user.role === ClassRoleEnum.STUDENT) {
          expectedUser = { ...user, teacher: null };
        } else {
          expectedUser = { ...user, student: null };
        }
        await expect(req).resolves.toStrictEqual(expectedUser);
      }
    });
  });

  describe('get user role by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const user of users) {
        const req = usersPersistence.getUserRoleById(user.id);
        await expect(req).resolves.toStrictEqual({ role: user.role });
      }
    });
  });
});
