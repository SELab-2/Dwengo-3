import { ClassRoleEnum } from './class.interfaces';
import { UserDetail } from './user.interfaces';

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
