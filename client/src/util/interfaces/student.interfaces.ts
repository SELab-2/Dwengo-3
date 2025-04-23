import { ClassShort } from './class.interfaces';
import { GroupShort } from './group.interfaces';

export interface StudentShort {
  id: string;
  user: {
    name: string;
    surname: string;
  };
}

export interface StudentDetail {
  id: string;
  user: {
    name: string;
    surname: string;
  };
  userId: string;
  classes: ClassShort[];
  groups: GroupShort[];
}
