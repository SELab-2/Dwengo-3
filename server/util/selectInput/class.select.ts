import { Prisma } from '@prisma/client';
import { teacherSelectShort } from './teacher.select';
import { studentSelectShort } from './student.select';
import { assignmentSelectShort } from './assignment.select';

export const classSelectShort: Prisma.ClassSelect = {
  id: true,
  name: true,
};

export const classSelectDetail: Prisma.ClassSelect = {
  id: true,
  name: true,
  teachers: {
    select: teacherSelectShort,
  },
  students: {
    select: studentSelectShort,
  },
  assignments: {
    select: assignmentSelectShort,
  },
};
