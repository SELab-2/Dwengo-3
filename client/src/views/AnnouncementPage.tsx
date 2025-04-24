import { useAuth } from '../hooks/useAuth';
import { Box, Paper } from '@mui/material';
import ClassNavigationBar from '../components/ClassNavigationBar';
import AnnouncementCard from '../components/AnnouncementCard';
import { useParams } from 'react-router-dom';
import { useAnnouncementById } from '../hooks/useAnnouncement';

function AnnouncementDetailpage() {
  const { user } = useAuth(); // NEEDED TO CHECK IF USER IS TEACHER OR STUDENT for future edit features
  const { announcementId } = useParams<{ announcementId: string }>(); // Get the announcement ID from the URL

  const { data: announcementData } = useAnnouncementById(announcementId!);

  const announcement = announcementData!;

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Paper
        sx={{
          p: 2,
          maxWidth: { xs: '90%', sm: 800 }, // Responsive width
          width: '100%',
          mx: 'auto',
          mt: 1,
        }}
      >
        <AnnouncementCard key={announcement.id} {...announcement} />
      </Paper>
    </Box>
  );
}

export default AnnouncementDetailpage;
