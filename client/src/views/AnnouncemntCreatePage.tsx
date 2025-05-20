import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAnnouncementCreate } from '../hooks/useAnnouncement';
import { useError } from '../hooks/useError';
import { useAuth } from '../hooks/useAuth';
import { AppRoutes } from '../util/app.routes';
import { useClassById } from '../hooks/useClass';
import { useState } from 'react';
import { AnnouncementDetail } from '../util/interfaces/announcement.interfaces';
import { useNotification } from '../hooks/useNotification';
import { Box, Button, TextField, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import ClassNavigationBar from '../components/ClassNavigationBar';
import BackButton from '../components/BackButton';

function AnnouncementCreatePage() {
  const { user } = useAuth();
  const { classId } = useParams<{ classId: string }>();
  const { t } = useTranslation();
  const announcementMutation = useAnnouncementCreate();
  const navigate = useNavigate();
  const { setError } = useError();
  const { setNotification } = useNotification();

  const teacher = user?.teacher;

  if (!teacher) {
    navigate(AppRoutes.classAnnouncements(classId!));
  }

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { data: classData, isLoading: isLoadingClass } = useClassById(classId!);

  if (isLoadingClass) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
        {t('loading')}
      </Typography>
    );
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(t('titleRequired'));
      return;
    }
    if (!content.trim()) {
      setError(t('contentRequired'));
      return;
    }

    announcementMutation.mutate(
      {
        title: title,
        content: content,
        classId: classId!,
      },
      {
        onSuccess: (response: AnnouncementDetail) => {
          setNotification(t('announcementSucces'));
          navigate(AppRoutes.announcement(response.id));
        },
        onError: (error: any) => {
          setError(
            error?.response?.data?.message || error?.message || t('errorSendingErrorMessage'),
          );
        },
      },
    );
  };
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData!.id} className={classData!.name} />
      <Box sx={{ width: '100%', maxWidth: { xs: '95%', sm: 800 }, mx: 'auto', mt: 4, p: 2 }}>
        <BackButton link={AppRoutes.classAnnouncements(classId!)} />

        <Typography variant="h4" gutterBottom>
          {t('createAnnouncement')}
        </Typography>
        <TextField
          required
          id="title-announcement"
          label={t('title')}
          variant="outlined"
          margin="normal"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 255 } }}
          helperText={`${title.length}/255`}
        />
        <TextField
          required
          id="content-announcement"
          label={t('content')}
          variant="outlined"
          multiline
          margin="dense"
          rows={10}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 750 } }}
          helperText={`${content.length}/750`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: { xs: '100%', sm: '40%' } }}
          >
            {t('post')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AnnouncementCreatePage;
