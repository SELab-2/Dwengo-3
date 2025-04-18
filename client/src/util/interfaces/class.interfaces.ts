import { AssignmentShort, AssignmentDetail, PopulatedAssignment } from './assignment.interfaces';
import { StudentShort, StudentDetail } from './student.interfaces';
import { TeacherShort, TeacherDetail } from './teacher.interfaces';

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

export interface PopulatedClass extends ClassShort {
  students: StudentShort[] | StudentDetail[];
  teachers: TeacherShort[] | TeacherDetail[];
  assignments: AssignmentShort[] | AssignmentDetail[] | PopulatedAssignment[];
}
