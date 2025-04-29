import { deleteRecords } from '../db/cleanDatabase';
import { PrismaClient } from '@prisma/client';

async function clean() {
  console.log('Starting database cleanup...');
  const prismaClient = new PrismaClient();
  // @ts-ignore
  await deleteRecords(prismaClient, true);
}

clean().then();
