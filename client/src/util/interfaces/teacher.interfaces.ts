import { ClassShort } from './class.interfaces';

export interface TeacherShort {
  id: string;
  name: string;
  surname: string;
}

export interface TeacherDetail {
  id: string;
  name: string;
  surname: string;
  userId: string;
  classes: ClassShort[];
}
