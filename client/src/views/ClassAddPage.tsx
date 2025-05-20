import { Box, Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import CustomTextField from '../components/textfields/CustomTextField';
import { useTranslation } from 'react-i18next';
import { useCreateClass, useJoinClass } from '../hooks/useClass';
import { ClassDetail } from '../util/interfaces/class.interfaces';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import { useError } from '../hooks/useError';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

function ClassAddPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { setError } = useError();
  const { setNotification } = useNotification();
  const navigate = useNavigate();

  const [className, setClassName] = useState('');
  const classCreateMutation = useCreateClass();

  const [classId, setClassId] = useState('');
  const classJoinMutation = useJoinClass();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    classCreateMutation.mutate(className, {
      onSuccess: (response: ClassDetail) => {
        navigate(AppRoutes.class(response.id));
      },
      onError: (error: any) => {
        setError(error?.response?.data?.message || error?.message || t('errorSendingErrorMessage'));
      },
    });
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    classJoinMutation.mutate(
      { classId, role: user!.role },
      {
        onSuccess: () => {
          setNotification(t('joinRequestSucces'));
          navigate(AppRoutes.myClasses);
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: 2,
      }}
    >
      {/* Create a new class as a teacher */}
      {user?.teacher ? (
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 500,
            mx: 'auto',
            mt: 6,
            p: 4,
            borderRadius: 2,
          }}
        >
          <form onSubmit={handleCreateSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {t('createAClass')}
                </Typography>
                <CustomTextField
                  value={className}
                  setValue={setClassName}
                  translation={t('className')}
                />
              </Box>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontWeight: 'normal',
                }}
                type="submit"
              >
                {t('createClass')}
              </Button>
            </Box>
          </form>
        </Paper>
      ) : null}

      {/* Join an existing class as a student or teacher */}
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 500,
          mx: 'auto',
          mt: 6,
          p: 4,
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleJoinSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {t('joinAClass')}
              </Typography>
              <CustomTextField value={classId} setValue={setClassId} translation={t('classId')} />
            </Box>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                fontWeight: 'normal',
              }}
              type="submit"
            >
              {t('joinClass')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default ClassAddPage;
