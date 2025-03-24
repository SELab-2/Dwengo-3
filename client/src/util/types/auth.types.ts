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

export interface UserData {
  id: number;
  username: string;
  email: string;
  role: ClassRoleEnum;
  name: string;
  surname: string;
}

export interface AuthContextType {
  user: UserData | null;
  login: (data: UserData) => void;
  register: (data: UserData) => void;
  logout: () => void;
}
