import { AssignmentDetail, AssignmentShort, PopulatedAssignment } from './assignment.types';
import { StudentDetail, StudentShort, TeacherDetail, TeacherShort } from './user.types';

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

export interface PopulatedClass extends ClassShort {
  students: StudentShort[] | StudentDetail[];
  teachers: TeacherShort[] | TeacherDetail[];
  assignments: AssignmentShort[] | AssignmentDetail[] | PopulatedAssignment[];
}
