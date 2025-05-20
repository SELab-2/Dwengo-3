import { Box, Button, Grid, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useNotStartedAssignments, useUpcomingAssignments } from '../hooks/useAssignment';
import LearningPathCard from '../components/learningPathCard';
import { AppRoutes } from '../util/app.routes';
import { myGroup } from '../util/helpers/group.helpers';
import { useNavigate } from 'react-router-dom';
import { useNewestDiscussions } from '../hooks/useDiscussion';
import { NewestDiscussionCard } from '../components/NewestDiscussionCard';

function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: upcomingDeadlines } = useUpcomingAssignments({
    studentId: user?.student?.id,
  });

  const { data: notStartedAssignments } = useNotStartedAssignments({
    studentId: user?.student?.id,
  });

  const { data: newestDiscussions } = useNewestDiscussions({
    userId: user?.id,
  });

  console.log('Upcoming Deadlines:', upcomingDeadlines);

  console.log('Not Started Assignments:', notStartedAssignments);

  console.log('Newest Discussions:', newestDiscussions);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        margin: MarginSize.large,
        flexDirection: 'column',
        gap: MarginSize.small,
      }}
    >
      <Typography variant="h4">
        {t('welcome')} {user?.name ?? 'Nobody'}!
      </Typography>

      {(user?.role === 'STUDENT' && (
        <>
          <Typography variant="h4">{t('upcomingDeadlines')}</Typography>
          {upcomingDeadlines?.length === 0 && (
            <Typography variant="body1">{t('noUpcomingDeadlines')}</Typography>
          )}
          {upcomingDeadlines?.map((assignment) => (
            <LearningPathCard
              key={assignment.id}
              assignment={assignment}
              userId={user?.id}
              visualizeProgress={false}
              actionButtons={
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(
                      AppRoutes.learningPath(
                        assignment.learningPath.id,
                        myGroup(assignment, user?.id)?.id,
                      ),
                    );
                  }}
                >
                  {t('continue')}
                </Button>
              }
            />
          ))}
          <Typography variant="h4">{t('startAssignments')}</Typography>
          {notStartedAssignments?.length === 0 && (
            <Typography variant="body1">{t('noNotStartedAssignments')}</Typography>
          )}
          {notStartedAssignments?.map((assignment) => (
            <LearningPathCard
              key={assignment.id}
              assignment={assignment}
              userId={user?.id}
              visualizeProgress={false}
              actionButtons={
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(
                      AppRoutes.learningPath(
                        assignment.learningPath.id,
                        myGroup(assignment, user?.id)?.id,
                      ),
                    );
                  }}
                >
                  {t('startAssignment')}
                </Button>
              }
            />
          ))}

          <Typography variant="h4">{t('newestDiscussions')}</Typography>
          {newestDiscussions?.length === 0 && (
            <Typography variant="body1">{t('noNewestDiscussions')}</Typography>
          )}
          {newestDiscussions?.map((discussion) => (
            <NewestDiscussionCard discussion={discussion}></NewestDiscussionCard>
          ))}
        </>
      )) || (
        <>
          <Typography variant="h4">{t('newestDiscussions')}</Typography>
          <Typography variant="h4">{t('finishedAssignments')}</Typography>
        </>
      )}
    </Box>
  );
}

export default HomePage;
