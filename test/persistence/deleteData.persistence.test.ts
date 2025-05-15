import { afterAll, describe, expect, test } from 'vitest';
import { deleteAllData, insertAssignmentsSubmissions, insertMessages } from './testData';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';

afterAll(async () => {
  await deleteAllData();
  PrismaSingleton.instance.$connect();
});

describe('delete all data test', () => {
  test('insert data and delete it', async () => {
    await insertMessages();
    await deleteAllData();
    await testEmpytDatabase();

    await insertAssignmentsSubmissions();
    await deleteAllData();
    await testEmpytDatabase();
  });
});

const testEmpytDatabase = async (): Promise<void> => {
  let count = PrismaSingleton.instance.announcement.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.assignment.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.assignmentSubmission.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.class.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.classJoinRequest.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.discussion.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.message.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.student.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.student.count();
  await expect(count).resolves.toBe(0);
  count = PrismaSingleton.instance.user.count();
  await expect(count).resolves.toBe(0);
};
