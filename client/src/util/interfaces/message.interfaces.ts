import { UUID } from 'crypto';
import { UserShort } from './user.interfaces';

export interface MessageShort {
  id: string;
  content: string;
  sender: UserShort;
  createdAt: Date;
}

export interface MessageDetail {
  id: string;
  content: string;
  sender: UserShort;
  discussionId: string;
  createdAt: Date;
}

export interface MessageCreate {
  content: string;
  discussionId: UUID;
}
