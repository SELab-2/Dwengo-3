import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useDiscussions } from '../hooks/useDiscussion';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import DiscussionCard from './DiscussionCard';
import { DiscussionShort } from '../util/interfaces/discussion.interfaces';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

function DiscussionListCard({ assignment }: { assignment: AssignmentShort2 }) {
  const { user } = useAuth();
  const { data: paginatedDiscussions, isLoading } = useDiscussions({
    assignmentId: assignment.id,
    userId: user?.id,
  });
  const { data: discussions } = paginatedDiscussions || { data: [] };
  const { t } = useTranslation();

  if (!isLoading && discussions.length != 0) {
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
          <Box
            sx={{
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
                {t('noDiscussionsFound')}
              </Typography>
            ) : (
              discussions.map((discussion: DiscussionShort) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
}

export default DiscussionListCard;
