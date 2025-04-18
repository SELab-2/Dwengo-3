import { AssignmentShort } from './assignment.interfaces';
import { StudentShort } from './student.interfaces';
import { TeacherShort } from './teacher.interfaces';

export const enum ClassRoleEnum {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface ClassShort {
  id: string;
  name: string;
}

export interface ClassDetail {
  id: string;
  name: string;
  students: StudentShort[];
  teachers: TeacherShort[];
  assignments: AssignmentShort[];
}
