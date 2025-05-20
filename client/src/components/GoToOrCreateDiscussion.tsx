import { Button, Tooltip } from '@mui/material';
import { AssignmentDetail } from '../util/interfaces/assignment.interfaces';
import { DiscussionShort } from '../util/interfaces/discussion.interfaces';
import { useTranslation } from 'react-i18next';
import ForumIcon from '@mui/icons-material/Forum';
import { AppRoutes } from '../util/app.routes';
import { useAuth } from '../hooks/useAuth';
import { UserDetail, UserShort } from '../util/interfaces/user.interfaces';

export function GoToOrCreateDiscussion({
  assignment,
  groupId,
  discussion,
  isMobile,
  user,
}: {
  assignment?: AssignmentDetail;
  groupId?: string;
  discussion?: DiscussionShort;
  isMobile?: boolean;
  user?: UserDetail;
}) {
  const { t } = useTranslation();

  return (
    <>
      {/* Show Go to Discussion if discussion exists, else show Create Discussion (students only) */}
      {assignment &&
        (discussion ? (
          <Tooltip title={t('goToDiscussion')}>
            <Button
              variant="outlined"
              startIcon={<ForumIcon />}
              sx={{
                ml: 2,
                whiteSpace: 'nowrap',
                minWidth: isMobile ? 0 : undefined,
                px: isMobile ? 1 : 2,
              }}
              href={AppRoutes.classDiscussions(
                assignment.class.id,
                assignment.id,
                groupId ?? undefined,
              )}
            >
              {!isMobile && t('goToDiscussion')}
            </Button>
          </Tooltip>
        ) : user?.student ? (
          <Tooltip title={t('createADiscussion')}>
            <Button
              variant="outlined"
              startIcon={<ForumIcon />}
              sx={{
                ml: 2,
                whiteSpace: 'nowrap',
                minWidth: isMobile ? 0 : undefined,
                px: isMobile ? 1 : 2,
              }}
              href={AppRoutes.discussionCreate(assignment.class.id, assignment.id)}
            >
              {!isMobile && t('createADiscussion')}
            </Button>
          </Tooltip>
        ) : null)}
    </>
  );
}
