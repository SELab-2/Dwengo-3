import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useDiscussions } from '../hooks/useDiscussion';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import DiscussionCard from './DiscussionCard';
import { DiscussionShort } from '../util/interfaces/discussion.interfaces';
import { useAuth } from '../hooks/useAuth';

function DiscussionListCard({
  assignment,
  expandedGroupId,
}: {
  assignment: AssignmentShort2;
  expandedGroupId?: string;
}) {
  const { user } = useAuth();
  const { data: paginatedDiscussions, isLoading } = useDiscussions({
    assignmentId: assignment.id,
    userId: user?.id,
  });
  const { data: discussions } = paginatedDiscussions || { data: [] };

  if (discussions.length === 0) {
    return null;
  }

  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        mb: 2,
        borderRadius: 2,
        border: '2px solid',
        borderColor: 'primary.main',
        boxShadow: 0,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {assignment.name}
        </Typography>
        {!isLoading && (
          <Box sx={{ overflowY: 'auto', pr: 1 }}>
            {discussions.map((discussion: DiscussionShort) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                expandedGroupId={expandedGroupId}
              />
            ))}
          </Box>
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default DiscussionListCard;
