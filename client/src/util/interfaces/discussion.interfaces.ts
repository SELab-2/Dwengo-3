import { GroupShort } from './group.interfaces';
import { MessageDetail } from './message.interfaces';
import { UserShort } from './user.interfaces';

export interface DiscussionShort {
  id: string;
}

export interface DiscussionDetail extends DiscussionShort {
  id: string;
  group: GroupShort;
  members: UserShort[];
  messages: MessageDetail[];
}
