import { ClassShort } from './class.interfaces';
import { UserShort } from './user.interfaces';

export interface ClassJoinRequestDetail {
  id: string;
  class: ClassShort;
  user: UserShort;
}
