import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
dotenv.config({ path: '../.env' });

/**
 * Deletes all data from the database in the correct order
 */
async function main() {
  await prisma.message.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.group.deleteMany();
  await prisma.learningNodeTransition.deleteMany();
  await prisma.learningPathNode.deleteMany();
  await prisma.learningObjectKeyword.deleteMany();
  await prisma.learningObject.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.classJoinRequest.deleteMany();
  await prisma.class.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.user.deleteMany();
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
