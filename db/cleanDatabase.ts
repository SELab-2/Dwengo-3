import { PrismaClient } from '@prisma/client';

async function deleteRecords(prisma: PrismaClient, deleteAdditionalRecords: boolean = false) {
  console.log('Deleting records...');

  try {
    await prisma.learningNodeTransition.deleteMany({});
    await prisma.learningPathNode.deleteMany({});
    await prisma.learningPath.deleteMany({});
    await prisma.learningObject.deleteMany({});
    await prisma.learningObjectKeyword.deleteMany({});
    console.log('Synced records deleted successfully!');

    if (deleteAdditionalRecords) {
      await prisma.assignmentSubmission.deleteMany({});
      await prisma.assignment.deleteMany({});
      await prisma.group.deleteMany({});
      await prisma.classJoinRequest.deleteMany({});
      await prisma.class.deleteMany({});
      await prisma.teacher.deleteMany({});
      await prisma.student.deleteMany({});
      await prisma.message.deleteMany({});
      await prisma.discussion.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.favorite.deleteMany({});
      await prisma.announcement.deleteMany({});
      console.log('Additional records deleted successfully!');
    }
  } catch (error) {
    console.error('Error deleting records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export { deleteRecords };
