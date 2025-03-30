import { ClassShort } from './class.types';
import { UserShort } from './user.types';

export interface ClassJoinRequestDetail {
  id: string;
  class: ClassShort;
  user: UserShort;
}
