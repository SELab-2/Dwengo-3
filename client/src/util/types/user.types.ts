import { ClassRoleEnum, ClassShort } from './class.types';
import { GroupShort } from './group.types';

export interface UserShort {
  id: string;
  name: string;
  surname: string;
  role: ClassRoleEnum;
}

export interface UserDetail extends UserShort {
  username: string;
  email: string;
  student?: StudentShort;
  teacher?: TeacherShort;
}

export interface StudentShort {
  id: string;
  user: {
    name: string;
    surname: string;
  };
}

export interface StudentDetail extends StudentShort {
  userID: string;
  classes: ClassShort[];
  groups: GroupShort[];
}

export interface TeacherShort {
  id: string;
  user: {
    name: string;
    surname: string;
  };
}

export interface TeacherDetail extends TeacherShort {
  userId: string;
  classes: ClassShort[];
}
