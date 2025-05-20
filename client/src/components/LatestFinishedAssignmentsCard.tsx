import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { GroupShort } from '../util/interfaces/group.interfaces';

interface RecentlyFinishedAssignmentCardProps {
  assignment: AssignmentShort2;
  group?: GroupShort;
}

export function LatestFinishedAssignmentCard({
  assignment,
  group,
}: RecentlyFinishedAssignmentCardProps) {
  const { t } = useTranslation();

  // Get class name from assignment
  const className = assignment.class?.name ?? t('loading');
  // Assignment name
  const assignmentName = assignment.name;

  // Group members
  const groupMembers = group?.students ?? [];

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {className + ' - ' + assignmentName}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          {groupMembers.map((student) => (
            <Chip
              key={student.id}
              label={`${student.user.name} ${student.user.surname}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default LatestFinishedAssignmentCard;
