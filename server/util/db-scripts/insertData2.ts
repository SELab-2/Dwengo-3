import * as dotenv from 'dotenv';
import { insertMessages } from '../../persistence/test/testData';
import { PrismaSingleton } from '../../persistence/prismaSingleton';

dotenv.config({ path: '../.env' });
insertMessages()
  .catch((error) => {
    console.error('Error inserting learning paths:', error);
  })
  .finally(async () => {
    await PrismaSingleton.instance.$disconnect();
  });
