import { useAuth } from '../hooks/useAuth';
import { Box, Paper, Typography } from '@mui/material';
import AnnouncementCard from '../components/AnnouncementCard';
import { useParams } from 'react-router-dom';
import { useAnnouncementById } from '../hooks/useAnnouncement';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton.tsx';
import { AppRoutes } from '../util/app.routes.ts';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { MarginSize } from '../util/size.ts';

function AnnouncementDetailpage() {
  const { user } = useAuth(); // NEEDED TO CHECK IF USER IS TEACHER OR STUDENT for future edit features
  const { t } = useTranslation();
  const { announcementId } = useParams<{ announcementId: string }>(); // Get the announcement ID from the URL

  const { data: announcement, isLoading } = useAnnouncementById(announcementId!);

  if (isLoading) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
        {t('loading')}
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={announcement?.class.id || ''} className={announcement?.class.name} />
      <Box sx={{ width: '100%', maxWidth: { xs: '95%', sm: '90%' }, mx: 'auto', mt: 4, p: 2 }}>
        <BackButton link={AppRoutes.classAnnouncements(announcement?.class.id || '')}></BackButton>
        <Paper
          sx={{
            p: 2,
            // maxWidth: { xs: '90%', sm: '90%' }, // Responsive width
            mx: 'auto',
            width: { xs: '90%', sm: '100%' },
            mt: 1,
          }}
        >
          <AnnouncementCard
            key={announcement?.id || 0}
            {...announcement!}
            date={announcement!.createdAt}
          />
        </Paper>
      </Box>
    </Box>
  );
}

export default AnnouncementDetailpage;
