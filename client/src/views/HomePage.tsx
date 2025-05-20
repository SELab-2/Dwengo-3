import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const maxItems = 5;

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

  const studentSections = [
    {
      key: 'upcomingDeadlines',
      title: t('upcomingDeadlines'),
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {upcomingDeadlines?.length === 0 && (
            <Typography variant="body1">{t('noUpcomingDeadlines')}</Typography>
          )}
          {upcomingDeadlines?.slice(0, maxItems).map((assignment) => (
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
                        myGroup(assignment, user!.id)?.id,
                      ),
                    );
                  }}
                >
                  {t('continue')}
                </Button>
              }
            />
          ))}
        </Box>
      ),
    },
    {
      key: 'startAssignments',
      title: t('startAssignments'),
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notStartedAssignments?.length === 0 && (
            <Typography variant="body1">{t('noNotStartedAssignments')}</Typography>
          )}
          {notStartedAssignments?.slice(0, maxItems).map((assignment) => (
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
                        myGroup(assignment, user!.id)?.id,
                      ),
                    );
                  }}
                >
                  {t('startAssignment')}
                </Button>
              }
            />
          ))}
        </Box>
      ),
    },
    {
      key: 'latestDiscussions',
      title: t('latestDiscussions'),
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {latestDiscussions?.length === 0 && (
            <Typography variant="body1">{t('noLatestDiscussions')}</Typography>
          )}
          {latestDiscussions
            ?.slice(0, maxItems)
            .map((discussion) => (
              <LatestDiscussionCard key={discussion.id} discussion={discussion} />
            ))}
        </Box>
      ),
    },
    {
      key: 'latestAnnouncements',
      title: t('latestAnnouncements'),
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {latestAnnouncements?.length === 0 && (
            <Typography variant="body1">{t('noLatestAnnouncements')}</Typography>
          )}
          {latestAnnouncements?.slice(0, maxItems).map((announcement) => (
            <Box
              onClick={() => navigate(AppRoutes.announcement(announcement.id))}
              key={announcement.id}
            >
              <AnnouncementCard
                id={announcement.id}
                date={announcement.createdAt}
                title={announcement.class.name + ' - ' + announcement.title}
                teacher={announcement.teacher}
                content={announcement.content}
              />
            </Box>
          ))}
        </Box>
      ),
    },
  ];

  const teacherSections = [
    {
      key: 'latestDiscussions',
      title: t('latestDiscussions'),
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {latestDiscussions?.length === 0 && (
            <Typography variant="body1">{t('noLatestDiscussions')}</Typography>
          )}
          {latestDiscussions
            ?.slice(0, maxItems)
            .map((discussion) => (
              <LatestDiscussionCard key={discussion.id} discussion={discussion} />
            ))}
        </Box>
      ),
    },
    {
      key: 'latestFinishedAssignments',
      title: t('latestFinishedAssignments'),
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {latestFinishedAssignments?.length === 0 && (
            <Typography variant="body1">{t('noLatestFinishedAssignments')}</Typography>
          )}
          {latestFinishedAssignments?.slice(0, maxItems).map(({ assignment, group }) => (
            <Box
              key={assignment.id}
              onClick={() =>
                navigate(AppRoutes.groupSubmission(assignment.class.id, assignment.id, group.id))
              }
            >
              <LatestFinishedAssignmentCard assignment={assignment} group={group} />
            </Box>
          ))}
        </Box>
      ),
    },
  ];

  const sections = user?.role === 'STUDENT' ? studentSections : teacherSections;

  if (!user) {
    return null;
  }

  // Split sections for two columns
  const mid = Math.ceil(sections.length / 2);
  const leftSections = sections.slice(0, mid);
  const rightSections = sections.slice(mid);

  return (
    <Box sx={{ flexGrow: 1, margin: MarginSize.small }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('welcome')} {user?.name ?? 'Nobody'}!
      </Typography>
      {isMobile ? (
        // Single column for mobile
        <Box>
          {sections.map((section) => (
            <Accordion key={section.key} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>{section.content}</AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        // Two independently scrollable columns for desktop
        <Box sx={{ display: 'flex', gap: 2, height: '70vh' }}>
          <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {leftSections.map((section) => (
              <Accordion key={section.key} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>{section.content}</AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {rightSections.map((section) => (
              <Accordion key={section.key} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>{section.content}</AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default HomePage;
