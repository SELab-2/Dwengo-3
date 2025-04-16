import { Prisma } from '@prisma/client';
import { classSelectShort } from './class.select';
import { groupSelectShort } from './group.select';
import { learningPathSelectShort } from './learningPath.select';
import { teacherSelectShort } from './teacher.select';

export const assignmentSelectDetail: Prisma.AssignmentSelect = {
  id: true,
  teacher: {
    select: teacherSelectShort,
  },
  class: {
    select: classSelectShort,
  },
  groups: {
    select: groupSelectShort,
  },
  learningPath: {
    select: learningPathSelectShort,
  },
};

export const assignmentSelectShort = {
  id: true,
  learningPathId: true,
};
