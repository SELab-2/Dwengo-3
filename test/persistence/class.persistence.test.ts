import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';
import { deleteAllData, insertClasses } from './testData';
import { ClassPersistence } from '../../server/persistence/class.persistence';
import { ClassDetail } from '../../server/util/types/class.types';

let classes: ClassDetail[] = [];
const classPersistence: ClassPersistence = new ClassPersistence();

describe('class persistence test', () => {
  beforeAll(async () => {
    classes = await insertClasses();
  });

  afterAll(async () => {
    await deleteAllData();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('get class by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const classData of classes) {
        const req = classPersistence.getClassById(classData.id);
        await expect(req).resolves.toStrictEqual(classData);
      }
    });

    test('request with unexisting id responds with an error', async () => {
      const id: string = 'class-0';
      const req = classPersistence.getClassById(id);
      await expect(req).rejects.toThrow();
    });
  });

  describe('test is teacher from class', () => {
    test('request with existing teacher id responds with true', async () => {
      for (const classData of classes) {
        for (const teacher of classData.teachers) {
          const req = classPersistence.isTeacherFromClass(teacher.id, classData.id);
          await expect(req).resolves.not.toBeFalsy();
        }
      }
    });

    test('request with unexisting teacher id responds with false', async () => {
      for (const classData of classes) {
        const req = classPersistence.isTeacherFromClass('sdflkqmfqlm', classData.id);
        await expect(req).resolves.toBeFalsy();
      }
    });
  });

  describe('test get classes', () => {
    test('request with existing teacher id responds with array of classes', async () => {
      const teacher = classes[0].teachers[0];
      const req = classPersistence.getClasses(
        { page: 1, pageSize: 10, skip: 0 },
        { teacherId: teacher.id },
      );
      const expectedClasses = classes.map((classData) => ({
        id: classData.id,
        name: classData.name,
      }));
      await expect(req).resolves.toEqual({
        data: expect.arrayContaining(expectedClasses),
        totalPages: 1,
      });
    });
  });

  describe('test update class', () => {
    test('request with existing id should update class correctly', async () => {
      for (const classData of classes) {
        classData.name = 'Test update';
        const updateData = { name: classData.name, id: classData.id };
        await classPersistence.updateClass(classData.id, updateData);
        const req = classPersistence.getClassById(classData.id);
        await expect(req).resolves.toStrictEqual(classData);
      }
    });
  });
});
