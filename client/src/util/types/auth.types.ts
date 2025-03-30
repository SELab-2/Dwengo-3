import { ClassRoleEnum } from './class.types';
import { UserDetail } from './user.types';

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

export interface AuthContextType {
  user: UserDetail | null;
  login: (data: UserDetail) => void;
  register: (data: UserDetail) => void;
  logout: () => void;
}
