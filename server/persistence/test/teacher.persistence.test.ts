import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { ClassShort } from '../../util/types/class.types';
import { FullUserType } from '../../util/types/user.types';
import { TeacherPersistence } from '../teacher.persistence';
import { deleteAllData, insertClassesWithStudents } from './testData';
import { PrismaSingleton } from '../prismaSingleton';
import { UsersPersistence } from '../auth/users.persistence';

const teachers: FullUserType[] = [];
const classes: ClassShort[] = [];
const teacherPersistence: TeacherPersistence = new TeacherPersistence();
const usersPersistence: UsersPersistence = new UsersPersistence();

describe('teacher persistence test', () => {
  beforeAll(async () => {
    const classesDetail = await insertClassesWithStudents();
    const teacherPromises = [];
    for (const classData of classesDetail) {
      for (const teacher of classData.teachers) {
        teacherPromises.push(usersPersistence.getUserById(teacher.userId));
      }
      classes.push({ name: classData.name, id: classData.id });
    }
    teachers.push(...(await Promise.all(teacherPromises)).filter((teacher) => teacher !== null));
  });

  afterAll(async () => {
    await deleteAllData();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('test get teacher by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const teacher of teachers) {
        const req = teacherPersistence.getTeacherById(teacher.teacher!.id);
        const expectedTeacher = {
          id: teacher.teacher!.id,
          userId: teacher.id,
          user: {
            name: teacher.name,
            surname: teacher.surname,
          },
          classes: expect.arrayContaining(classes),
        };
        await expect(req).resolves.toStrictEqual(expectedTeacher);
      }
    });

    test('request with unexisting id responds with an error', async () => {
      const req = teacherPersistence.getTeacherById('dqksdjfqj');
      await expect(req).rejects.toThrow();
    });
  });

  describe('test get teacher by userId', () => {
    test('request with existing id responds correctly', async () => {
      for (const teacher of teachers) {
        const req = teacherPersistence.getTeacherByUserId(teacher.id);
        const expectedTeacher = {
          id: teacher.teacher!.id,
          userId: teacher.id,
          user: {
            name: teacher.name,
            surname: teacher.surname,
          },
          classes: expect.arrayContaining(classes),
        };
        await expect(req).resolves.toStrictEqual(expectedTeacher);
      }
    });

    test('request with unexisting id responds with an error', async () => {
      const req = teacherPersistence.getTeacherByUserId('dqksdjfqj');
      await expect(req).rejects.toThrow();
    });
  });

  describe('test get teachers', () => {
    test('request all teachers with classId', async () => {
      const expectedTeachers = teachers.map((teacher) => ({
        id: teacher.teacher!.id,
        userId: teacher.id,
        user: {
          name: teacher.name,
          surname: teacher.surname,
        },
      }));
      expect(expectedTeachers).not.toEqual([]);
      for (const classData of classes) {
        const req = teacherPersistence.getTeachers(
          { page: 1, pageSize: 10, skip: 0 },
          { classId: classData.id },
        );
        await expect(req).resolves.toEqual({
          data: expect.arrayContaining(expectedTeachers),
          totalPages: 1,
        });
      }
    });
  });
});
