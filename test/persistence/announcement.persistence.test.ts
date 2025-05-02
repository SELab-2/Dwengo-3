import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { AnnouncementDetail } from '../../server/util/types/announcement.types';
import { AnnouncementPersistence } from '../../server/persistence/announcement.persistence';
import { deleteAllData, insertAnnouncements } from './testData';
import { ClassPersistence } from '../../server/persistence/class.persistence';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';

let announcements: AnnouncementDetail[] = [];
const announcementPersistence: AnnouncementPersistence = new AnnouncementPersistence();
const classPersistence: ClassPersistence = new ClassPersistence();
describe('announcement persistence test', () => {
  beforeAll(async () => {
    announcements = await insertAnnouncements();
  });

  afterAll(async () => {
    await deleteAllData();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('test get announcement by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const announcement of announcements) {
        const req = announcementPersistence.getAnnouncementById(announcement.id);
        await expect(req).resolves.toStrictEqual(announcement);
      }
    });

    test('request with unexisting id responds with an error', async () => {
      const req = announcementPersistence.getAnnouncementById('skjdfqsmlf');
      await expect(req).rejects.toThrow();
    });
  });

  describe('test check announcement is from teacher', () => {
    test('request with existing teacher id responds with nothing', async () => {
      for (const announcement of announcements) {
        const req = announcementPersistence.checkAnnouncementIsFromTeacher(
          announcement.id,
          announcement.teacher.id,
        );
        await expect(req).resolves.not.toThrow();
      }
    });

    test('request with unexisting teacher id responds with an error', async () => {
      const req = announcementPersistence.checkAnnouncementIsFromTeacher(
        announcements[0].id,
        'qlskfqlfmjq',
      );
      await expect(req).rejects.toThrow();
    });
  });

  describe('test get announcemnts', () => {
    test('request with existing classId responds correctly', async () => {
      for (const announcement of announcements) {
        const req = announcementPersistence.getAnnouncements(
          { classId: announcement.class.id },
          { page: 1, pageSize: 10, skip: 0 },
        );
        const expectedAnnouncements = announcements
          .filter((ann) => ann.class.id === announcement.class.id)
          .map((ann) => ({
            id: ann.id,
            title: ann.title,
          }));
        expect(expectedAnnouncements).not.toEqual([]);
        await expect(req).resolves.toEqual({
          data: expect.arrayContaining(expectedAnnouncements),
          totalPages: 1,
        });
      }
    });

    test('request with existing teacherId responds correctly', async () => {
      for (const announcement of announcements) {
        const classData = await classPersistence.getClassById(announcement.class.id);
        for (const teacher of classData.teachers) {
          const req = announcementPersistence.getAnnouncements(
            { teacherId: teacher.id },
            { page: 1, pageSize: 10, skip: 0 },
          );
          const expectedAnnouncements = announcements.map((ann) => ({
            id: ann.id,
            title: ann.title,
          }));
          expect(expectedAnnouncements).not.toEqual([]);
          await expect(req).resolves.toEqual({
            data: expect.arrayContaining(expectedAnnouncements),
            totalPages: 1,
          });
        }
      }
    });

    test('request with existing studentId responds correctly', async () => {
      for (const announcement of announcements) {
        const classData = await classPersistence.getClassById(announcement.class.id);
        for (const student of classData.students) {
          const req = announcementPersistence.getAnnouncements(
            { studentId: student.id },
            { page: 1, pageSize: 10, skip: 0 },
          );
          const expectedAnnouncements = announcements.map((ann) => ({
            id: ann.id,
            title: ann.title,
          }));
          expect(expectedAnnouncements).not.toEqual([]);
          await expect(req).resolves.toEqual({
            data: expect.arrayContaining(expectedAnnouncements),
            totalPages: 1,
          });
        }
      }
    });
  });

  describe('test update announcement', async () => {
    test('request with existing id should update announcemnent correctly', async () => {
      for (const announcement of announcements) {
        announcement.title = 'new title';
        announcement.content = 'new content';
        const req = announcementPersistence.updateAnnouncement(announcement.id, {
          title: announcement.title,
          content: announcement.content,
        });
        await expect(req).resolves.toStrictEqual(announcement);
        const req2 = announcementPersistence.getAnnouncementById(announcement.id);
        await expect(req2).resolves.toStrictEqual(announcement);
      }
    });
  });
});
