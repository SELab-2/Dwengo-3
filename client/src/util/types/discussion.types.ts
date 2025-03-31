import { GroupShort } from './group.types';
import { MessageDetail } from './message.types';
import { UserShort } from './user.types';

export interface DiscussionShort {
  id: string;
}

export interface DiscussionDetail extends DiscussionShort {
  group: GroupShort;
  members: UserShort[];
  messages: MessageDetail[];
}
