import { ClassRoleEnum } from './class.interfaces';
import { StudentShort } from './student.interfaces';
import { TeacherShort } from './teacher.interfaces';

export interface UserShort {
  id: string;
  name: string;
  surname: string;
  role: ClassRoleEnum;
}

export interface UserDetail {
  id: string;
  name: string;
  surname: string;
  role: ClassRoleEnum;
  username: string;
  email: string;
  student?: StudentShort;
  teacher?: TeacherShort;
}
