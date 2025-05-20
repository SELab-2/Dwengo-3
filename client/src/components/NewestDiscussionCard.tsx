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
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {assignment?.name ?? t('loading')}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {classData?.name ?? t('loading')}
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('lastMessage')}: {formattedTime}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoToDiscussion}>
          {t('goToDiscussion')}
        </Button>
      </CardContent>
    </Card>
  );
}
