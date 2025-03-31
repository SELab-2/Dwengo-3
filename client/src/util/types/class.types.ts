import { AssignmentShort } from './assignment.types';
import { StudentShort, TeacherShort } from './user.types';

export const enum ClassRoleEnum {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface ClassShort {
  id: string;
  name: string;
}

export interface ClassDetail extends ClassShort {
  students: StudentShort[];
  teachers: TeacherShort[];
  assignments: AssignmentShort[];
}
