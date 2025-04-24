import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useDetailedDiscussionsByGroupIds } from '../hooks/useDiscussion';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import DiscussionCard from './DiscussionCard';

function DiscussionListCard({ assignment }: { assignment: AssignmentShort2 }) {
  const groupIds = assignment.groups.map((group) => group.id);
  const { data: paginatedData, isLoading } = useDetailedDiscussionsByGroupIds(groupIds);
  const { data: discussions } = paginatedData || { data: [] };

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {assignment.learningPath.title}
        </Typography>
        <Box
          sx={{
            maxHeight: 300,
            overflowY: 'auto',
            pr: 1,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : discussions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Geen discussies gevonden.
            </Typography>
          ) : (
            discussions.map((discussion: any) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default DiscussionListCard;
