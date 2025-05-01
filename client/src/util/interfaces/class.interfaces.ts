import { AssignmentDetail, AssignmentShort, PopulatedAssignment } from './assignment.interfaces';
import { StudentDetail, StudentShort } from './student.interfaces';
import { TeacherDetail, TeacherShort } from './teacher.interfaces';

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
  notes: string;
}

export interface PopulatedClass extends ClassShort {
  students: StudentShort[] | StudentDetail[];
  teachers: TeacherShort[] | TeacherDetail[];
  assignments: AssignmentShort[] | AssignmentDetail[] | PopulatedAssignment[];
}

export interface ClassCreate {
  name: string;
}

export interface ClassUpdate {
  name?: string;
  description?: string;
}
