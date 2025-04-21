import { ClassShort } from './class.interfaces';
import { UserShort } from './user.interfaces';

export enum Decision {
  'accept',
  'deny',
}

export interface ClassJoinRequestDetail {
  id: string;
  class: ClassShort;
  user: UserShort;
}

export interface ClassJoinRequestCreate {
  classId: string;
}

export interface ClassJoinRequestPost {
  requestId: string;
  decision: Decision;
}
