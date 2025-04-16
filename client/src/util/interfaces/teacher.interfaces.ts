import { ClassShort } from './class.interfaces';

export interface TeacherShort {
  id: string;
  name: string;
  surname: string;
}

export interface TeacherDetail extends TeacherShort {
  userId: string;
  classes: ClassShort[];
}
