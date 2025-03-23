import { ClassRoleEnum } from './class.types';

export interface LoginData {
  email: string;
  password: string;
  role: ClassRoleEnum;
}

export interface RegisterData {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: ClassRoleEnum;
}
