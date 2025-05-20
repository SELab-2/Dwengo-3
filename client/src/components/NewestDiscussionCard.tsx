import { Card, CardContent, Typography, Button, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DiscussionDetail } from '../util/interfaces/discussion.interfaces';
import { AppRoutes } from '../util/app.routes';
import { useAssignmentById } from '../hooks/useAssignment';
import { formatDate } from '../util/helpers/date.helpers';

export function NewestDiscussionCard({ discussion }: { discussion: DiscussionDetail }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get assignmentId and classId from discussion
  const assignmentId = discussion.group.assignmentId;
  const groupId = discussion.group.id;

  // Load assignment and class data
  const { data: assignment, isLoading } = useAssignmentById(assignmentId);
  const classData = assignment?.class;

  // Get group members
  const groupMembers = discussion.members;

  // Get latest message timestamp
  const latestMessage = discussion.messages?.length
    ? discussion.messages[discussion.messages.length - 1]
    : null;
  const latestTimestamp = latestMessage?.createdAt;

  // Format timestamp
  const formattedTime = latestTimestamp
    ? formatDate(new Date(latestTimestamp))
    : t('noMessagesYet');

  // Button handler
  const handleGoToDiscussion = () => {
    // URL: /class/:classId/discussions#assignmentId:groupId
    navigate(`${AppRoutes.classDiscussions(classData!.id)}#${assignmentId}:${groupId}`);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }} onClick={handleGoToDiscussion}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {classData?.name + ' - ' + assignment?.name}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          {groupMembers.map((user) => (
            <Chip
              key={user.id}
              label={`${user.name} ${user.surname}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t('lastMessage')}: {formattedTime} {t('by')} {latestMessage?.sender.name}{' '}
          {latestMessage?.sender.surname}
        </Typography>
      </CardContent>
    </Card>
  );
}
