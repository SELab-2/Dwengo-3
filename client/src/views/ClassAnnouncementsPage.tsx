import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth.ts';
import { useTranslation } from 'react-i18next';
import AnnouncementCard from '../components/AnnouncementCard.tsx';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { useClassById } from '../hooks/useClass.ts';
import { useAnnouncementDetails } from '../hooks/useAnnouncement.ts';
import Paginator from '../components/Paginator';
import { useState } from 'react';
import { AppRoutes } from '../util/app.routes.ts';

function ClassAnnouncementsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const { classId } = useParams<{ classId: string }>();
  const { data: classData } = useClassById(classId!);

  const studentId = user?.student?.id;
  const teacherId = user?.teacher?.id;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: paginatedData, isLoading } = useAnnouncementDetails(
    classId,
    teacherId,
    studentId,
    page,
    pageSize,
  );

  const announcements = paginatedData?.data ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classId!} className={classData?.name} />
      <Paper
        sx={{
          p: 2,
          maxWidth: { xs: '90%', sm: 800 }, // Responsive width
          width: '100%',
          mx: 'auto',
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
            gap: 1, // Adds spacing when stacked
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('announcements')}
          </Typography>
          {user?.teacher && (
            <Button
              variant="contained"
              sx={{ backgroundColor: theme.palette.primary.main }}
              onClick={() => {
                navigate(AppRoutes.classAnnouncementCreate(classId!));
              }}
            >
              {t('createNewAnnouncement')}
            </Button>
          )}
        </Box>

        {isLoading ? (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
            {t('loading')}
          </Typography>
        ) : announcements.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
            {t('noAnnouncements')}
          </Typography>
        ) : (
          // Paginator Component
          <Paginator
            data={announcements}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            renderItem={(announcement) => (
              <AnnouncementCard
                key={announcement.id}
                {...announcement}
                date={announcement.createdAt}
              />
            )}
            renderContainer={(children) => <Stack spacing={2}>{children}</Stack>}
          />
        )}
      </Paper>
    </Box>
  );
}

export default ClassAnnouncementsPage;
