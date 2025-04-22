import * as dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/nl_BE';

dotenv.config({ path: '../.env' });

export async function addMockData(prisma: PrismaClient) {
  await prisma.assignmentSubmission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.classJoinRequest.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.discussion.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.announcement.deleteMany({});

  await prisma.student.deleteMany({});
  // await prisma.teacher.deleteMany({});
  await prisma.user.deleteMany({ where: { provider: 'LOCAL' } });

  const user = await prisma.user.findFirst({
    where: { provider: 'GOOGLE' },
    include: { teacher: true },
  });

  if (!user) {
    throw new Error('No user found with provider GOOGLE');
  }

  const students = [];
  // create 10 students
  for (let i = 0; i < 10; i++) {
    students.push(
      await prisma.user.create({
        data: {
          username: `student${i}`,
          password: 'password',
          name: faker.person.firstName(),
          surname: faker.person.lastName(),
          email: faker.internet.email(),
          provider: 'LOCAL',
          role: 'STUDENT',
          student: {
            create: {},
          },
        },
        include: {
          student: true,
        },
      }),
    );
  }

  await prisma.class.create({
    data: {
      name: 'Klas 5A',
      teachers: {
        connect: {
          id: user!.teacher!.id,
        },
      },
      students: {
        connect: students.slice(0, 8).map((student) => ({
          id: student.student!.id,
        })),
      },
      classJoinRequests: {
        create: students.slice(8).map((student) => ({
          userId: student.id,
        })),
      },
    },
  });
}

async function main() {
  const prisma = new PrismaClient();
  console.log('Starting to add mock data...');
  await addMockData(prisma);
  console.log('Mock data added successfully!');
}

main();

export { main };
