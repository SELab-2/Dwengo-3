import { Prisma } from '@prisma/client';
import { groupSelectShort } from './group.select';
import { learningPathNodeSelectShort } from './learningPathNode.select';

export const assignmentSubmissionSelectDetail: Prisma.AssignmentSubmissionSelect = {
  id: true,
  submission: true,
  group: {
    select: groupSelectShort,
  },
  node: {
    select: learningPathNodeSelectShort,
  },
};

export const assignmentSubmissionSelectShort: Prisma.AssignmentSubmissionSelect = {
  id: true,
};
