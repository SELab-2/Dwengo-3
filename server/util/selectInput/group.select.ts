import { Prisma } from '@prisma/client';
import { assignmentSelectShort } from './assignment.select';
import { discussionSelectShort } from './discussion.select';
import { studentSelectShort } from './student.select';

export const groupSelectShort: Prisma.GroupSelect = {
  id: true,
  progress: true,
  assignmentId: true,
  name: true,
  students: {
    select: studentSelectShort,
  },
};

export const groupSelectDetail: Prisma.GroupSelect = {
  id: true,
  name: true,
  progress: true,
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
