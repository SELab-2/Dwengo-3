import { teacherSelectShort } from './teacher.select';
import { studentSelectShort } from './student.select';
import { assignmentSelectShort } from './assignment.select';

export const classSelectShort = {
  id: true,
  name: true,
};

export const classSelectDetail = {
  id: true,
  name: true,
  teachers: {
    select: teacherSelectShort,
  },
  students: {
    select: studentSelectShort,
  },
  assignment: {
    select: assignmentSelectShort,
  },
};
