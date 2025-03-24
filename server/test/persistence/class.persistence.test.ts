import { describe, test, beforeAll, afterAll, expect } from 'vitest';
import { PrismaSingleton } from '../../persistence/prismaSingleton';

describe('class persistence test', () => {
  beforeAll(async () => {
    await PrismaSingleton.instance.class.createMany({
      data: [
        {
          id: 'class-1',
          name: 'Math',
        },
        {
          id: 'class-2',
          name: 'Physics',
        },
        {
          id: 'class-3',
          name: 'Biology',
        },
      ],
    });
  });

  afterAll(async () => {
    await PrismaSingleton.instance.class.deleteMany();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('get class by id', () => {
    test('request with existing id responds correctly', async () => {
      const id: string = 'class-1';
      const req = PrismaSingleton.instance.class.findUnique({
        where: { id },
      });
      await expect(req).resolves.toStrictEqual({ id: id, name: 'Math' });
    });

    test('request with unexisting id responds with null', async () => {
      const id: string = 'class-0';
      const req = PrismaSingleton.instance.class.findUnique({
        where: { id },
      });
      await expect(req).resolves.toBeNull();
    });
  });
});
