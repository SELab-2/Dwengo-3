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

function AnnouncementDetailpage({ classId, className }: { classId: string; className: string }) {
  const { user } = useAuth(); // NEEDED TO CHECK IF USER IS TEACHER OR STUDENT for future edit features
  const { t } = useTranslation();
  const { announcementId } = useParams<{ announcementId: string }>(); // Get the announcement ID from the URL

  const { data: announcement, isLoading } = useAnnouncementById(announcementId!);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classId} className={className} />
      {isLoading && (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
          {t('loading')}
        </Typography>
      )}

      {!isLoading && (
        <Box sx={{ width: '100%', maxWidth: { xs: '95%', sm: '90%' }, mx: 'auto', mt: 4, p: 2 }}>
          <BackButton link={AppRoutes.classAnnouncements(classId)}></BackButton>
          <Paper
            sx={{
              p: 2,
              // maxWidth: { xs: '90%', sm: '90%' }, // Responsive width
              mx: 'auto',
              width: { xs: '90%', sm: '100%' },
              mt: 1,
            }}
          >
            <AnnouncementCard key={announcement?.id || 0} {...announcement!} />
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default AnnouncementDetailpage;
