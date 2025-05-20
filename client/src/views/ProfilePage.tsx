import { Avatar, Box, Button, Container, Divider, Paper, Typography } from '@mui/material';
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { MarginSize } from '../util/size';
import { useAuth, useDelete, useLogout } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import NotLoggedIn from '../components/NotLoggedIn';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import { useError } from '../hooks/useError';
import { useState } from 'react';
import YesNoDialogProps from '../components/YesNoDialog';

function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const logoutMutation = useLogout();
  const deleteMutation = useDelete();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setError } = useError();
  const [open, setOpen] = useState<boolean>(false);

  const handleLogout = () => {
    logoutMutation.mutateAsync(undefined, {
      onSuccess: () => {
        // Clear user data and tokens
        logout();

        // Redirect to the login page or home page
        navigate(AppRoutes.login);
      },
      onError: (error: any) => {
        // Handle error (e.g., show error message)
        setError(error?.response?.data?.message || error?.message || t('errorSendingErrorMessage'));
      },
    });
  };

  const handleDeleteAccount = () => {
    deleteMutation.mutateAsync(undefined, {
      onSuccess: () => {
        logout();
        navigate(AppRoutes.login);
      },

      onError: (error: any) => {
        setError(error?.response?.data?.message || error?.message || t('errorSendingErrorMessage'));
      },
    });
  };

  if (!user) {
    return <NotLoggedIn />;
  }

  return (
    <Container sx={{ py: MarginSize.large }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          gap: MarginSize.small,
        }}
      >
        <YesNoDialogProps
          title={t('deleteAccountMessage')}
          warning={t('deleteAccountWarning')}
          open={open}
          onClose={() => setOpen(false)}
          onYes={() => {
            setOpen(false);
            handleDeleteAccount();
          }}
        />
        <Paper elevation={5} sx={{ p: 3, width: '100%', flexGrow: 1 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 80, height: 80, mr: 3 }} />
            <Box>
              <Typography variant="h5" component="h1" gutterBottom>
                {user?.name} {user?.surname}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user?.role === 'STUDENT' ? t('student') : t('teacher')}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center">
            <EmailIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {t('email')}: {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            justifyContent="space-between"
            mt={2}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              fullWidth
              onClick={() => setOpen(true)}
            >
              {t('deleteAccount')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ExitToAppIcon />}
              fullWidth
              onClick={handleLogout}
            >
              {t('logout')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ProfilePage;
