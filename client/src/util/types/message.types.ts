import { UserShort } from './user.types';

export interface MessageShort {
  id: string;
  content: string;
  sender: UserShort;
  createdAt: Date;
}

export interface MessageDetail extends MessageShort {
  discussionId: string;
}
