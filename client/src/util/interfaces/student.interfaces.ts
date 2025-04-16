import { ClassShort } from './class.interfaces';
import { GroupShort } from './group.interfaces';

export interface StudentShort {
  id: string;
  name: string;
  surname: string;
}

export interface StudentDetail extends StudentShort {
  userID: string;
  classes: ClassShort[];
  groups: GroupShort[];
}
