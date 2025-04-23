import * as dotenv from 'dotenv';
import { insertLearningPaths } from '../../persistence/test/testData';
import { PrismaSingleton } from '../../persistence/prismaSingleton';

dotenv.config({ path: '../.env' });
insertLearningPaths()
  .catch((error) => {
    console.error('Error inserting learning paths:', error);
  })
  .finally(async () => {
    await PrismaSingleton.instance.$disconnect();
  });