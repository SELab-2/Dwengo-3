import { UUID } from 'crypto';
import { ClassShort } from './class.interfaces';
import { UserShort } from './user.interfaces';

enum decision {
  'accept',
  'deny',
}

export interface ClassJoinRequestDetail {
  id: UUID;
  class: ClassShort;
  user: UserShort;
}

export interface ClassJoinRequestCreate {
  classId: UUID;
}

export interface ClassJoinRequestPost {
  requestId: UUID;
  decision: decision;
}
