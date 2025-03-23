import { Prisma } from '@prisma/client';
import { assignmentSelectShort } from './assignment.select';
import { discussionSelectShort } from './discussion.select';
import { studentSelectShort } from './student.select';

export const groupSelectShort: Prisma.GroupSelect = {
  id: true,
  nodeId: true, //TODO change to nodeIndex
  assignmentId: true,
};

export const groupSelectDetail: Prisma.GroupSelect = {
  id: true,
  nodeId: true, //TODO change to nodeIndex
  assignment: {
    select: assignmentSelectShort,
  },
  discussion: {
    select: discussionSelectShort,
  },
  students: {
    select: studentSelectShort,
  },
};
