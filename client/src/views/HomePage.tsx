import { Box, Button, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
  useLatestsFinishedAssignments,
  useNotStartedAssignments,
  useUpcomingAssignments,
} from '../hooks/useAssignment';
import LearningPathCard from '../components/learningPathCard';
import { AppRoutes } from '../util/app.routes';
import { myGroup } from '../util/helpers/group.helpers';
import { useNavigate } from 'react-router-dom';
import { useLatestDiscussions } from '../hooks/useDiscussion';
import { LatestDiscussionCard } from '../components/LatestDiscussionCard';
import { useLatestsAnnouncements } from '../hooks/useAnnouncement';
import AnnouncementCard from '../components/AnnouncementCard';
import LatestFinishedAssignmentCard from '../components/LatestFinishedAssignmentsCard';

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

  const { data: latestDiscussions } = useLatestDiscussions({
    userId: user?.id,
  });

  const { data: latestAnnouncements } = useLatestsAnnouncements({
    studentId: user?.student?.id,
  });

  const { data: latestFinishedAssignments } = useLatestsFinishedAssignments({
    teacherId: user?.teacher?.id,
  });

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

          <Typography variant="h4">{t('latestDiscussions')}</Typography>
          {latestDiscussions?.length === 0 && (
            <Typography variant="body1">{t('noLatestDiscussions')}</Typography>
          )}
          {latestDiscussions?.map((discussion) => (
            <LatestDiscussionCard
              key={discussion.id}
              discussion={discussion}
            ></LatestDiscussionCard>
          ))}

          <Typography variant="h4">{t('latestAnnouncements')}</Typography>
          {latestAnnouncements?.length === 0 && (
            <Typography variant="body1">{t('noLatestAnnouncements')}</Typography>
          )}
          {latestAnnouncements?.map((announcement) => (
            <Box
              onClick={() => navigate(AppRoutes.announcement(announcement.id))}
              key={announcement.id}
            >
              <AnnouncementCard
                id={announcement.id}
                title={announcement.class.name + ' - ' + announcement.title}
                teacher={announcement.teacher}
                content={announcement.content}
              ></AnnouncementCard>
            </Box>
          ))}
        </>
      )) || (
        <>
          <Typography variant="h4">{t('latestDiscussions')}</Typography>
          {latestDiscussions?.length === 0 && (
            <Typography variant="body1">{t('noLatestDiscussions')}</Typography>
          )}
          {latestDiscussions?.map((discussion) => (
            <LatestDiscussionCard
              key={discussion.id}
              discussion={discussion}
            ></LatestDiscussionCard>
          ))}
          <Typography variant="h4">{t('latestFinishedAssignments')}</Typography>
          {latestFinishedAssignments?.length === 0 && (
            <Typography variant="body1">{t('noLatestFinishedAssignments')}</Typography>
          )}
          {latestFinishedAssignments?.map(({ assignment, group }) => (
            <Box
              key={assignment.id}
              onClick={() =>
                navigate(AppRoutes.groupSubmission(assignment.class.id, assignment.id, group.id))
              }
            >
              <LatestFinishedAssignmentCard
                assignment={assignment}
                group={group}
              ></LatestFinishedAssignmentCard>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}

export default HomePage;
