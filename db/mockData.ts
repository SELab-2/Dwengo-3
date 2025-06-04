import * as dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/nl_BE';

dotenv.config({ path: '../.env' });

export async function addMockData(prisma: PrismaClient) {
  // await prisma.group.deleteMany({});
  // await prisma.assignment.deleteMany({});
  // await prisma.assignmentSubmission.deleteMany({});
  // await prisma.classJoinRequest.deleteMany({});
  // await prisma.announcement.deleteMany({});
  // await prisma.class.deleteMany({});
  // await prisma.message.deleteMany({});
  // await prisma.discussion.deleteMany({});
  // await prisma.favorite.deleteMany({});
  //
  // await prisma.student.deleteMany({});
  // // await prisma.teacher.deleteMany({});
  // await prisma.user.deleteMany({ where: { provider: 'LOCAL' } });

  const users = await prisma.user.findMany({
    where: { email: 'peter.leerkracht@test.com' },
    include: { teacher: true },
  });

  for (const user of users) {
    if (!user) {
      throw new Error('No user found with provider GOOGLE');
    }

    // find random learning path
    const learningPath = (await prisma.learningPath.findFirst({
      where: {
        id: '67e51a19531d59ac37659f58',
      },
      include: { learningPathNodes: true },
    }))!;

    const students = [
      (await prisma.user.findFirst({
        where: { email: 'robbe.student@test.com' },
        include: { student: true },
      }))!,
    ];
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

    const classData = await prisma.class.create({
      data: {
        name: 'Klas 5A',
        teachers: {
          connect: {
            id: user!.teacher!.id,
          },
        },
        students: {
          connect: students.slice(0, 7).map((student) => ({
            id: student.student!.id,
          })),
        },
        classJoinRequests: {
          create: students.slice(7).map((student) => ({
            userId: student.id,
          })),
        },
        description: faker.lorem.paragraph(),
      },
    });

    // Create assignment with groups and fetch the created groups
    const assignment = await prisma.assignment.create({
      data: {
        class: {
          connect: {
            id: classData.id,
          },
        },
        teacher: {
          connect: {
            id: user!.teacher!.id,
          },
        },
        learningPath: {
          connect: {
            id: learningPath.id,
          },
        },
        groups: {
          create: students.slice(0, 7).map((student) => ({
            name: `Group of ${student.name}`,
            students: {
              connect: {
                id: student.student!.id,
              },
            },
            progress: Array.from({ length: 4 }, () =>
              Math.floor(Math.random() * learningPath.learningPathNodes.length),
            ).sort((a, b) => a - b),
          })),
        },
        deadline: faker.date.future(),
        name: `Assignment about ${faker.food.dish()}`,
        description: faker.lorem.paragraph(),
      },
      include: {
        groups: {
          include: {
            students: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // --- Add discussions for each group ---
    for (const group of assignment.groups) {
      // Get all student user IDs in the group
      const studentUserIds = group.students.map((s) => s.user.id);
      // Add the teacher's user ID(s) as well
      const teacherUserIds = [user.id];

      // Create the discussion
      const discussion = await prisma.discussion.create({
        data: {
          group: { connect: { id: group.id } },
          members: {
            connect: [
              ...studentUserIds.map((id) => ({ id })),
              ...teacherUserIds.map((id) => ({ id })),
            ],
          },
        },
      });

      // Optionally, add a few messages to the discussion
      for (let m = 0; m < 3; m++) {
        await prisma.message.create({
          data: {
            content: faker.lorem.sentence(),
            sender: { connect: { id: studentUserIds[m % studentUserIds.length] } },
            discussion: { connect: { id: discussion.id } },
          },
        });
      }
    }

    for (let i = 0; i < 12; i++) {
      const content = faker.food.description() + `\n\n${faker.lorem.text()}`;

      await prisma.announcement.create({
        data: {
          title: `Announcement about ${faker.food.dish()}`,
          content: content,
          class: {
            connect: {
              id: classData.id,
            },
          },
          teacher: {
            connect: {
              id: user!.teacher!.id,
            },
          },
        },
      });
    }
  }
}

async function main() {
  const prisma = new PrismaClient();
  console.log('Starting to add mock data...');
  await addMockData(prisma);
  console.log('Mock data added successfully!');
}

main();

export { main };
