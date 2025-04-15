import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Container,
} from '@mui/material';
import {
  Email as EmailIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { MarginSize } from '../util/size';
import { useAuth, useLogout } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import NotLoggedIn from '../components/NotLoggedIn';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';

function ProfilePage() {
  // TODO: call to API to get user data?
  const { user } = useAuth();
  const { t } = useTranslation();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutateAsync(undefined, {
      onSuccess: () => {
        // Clear user data and tokens
        logout();

        // Redirect to the login page or home page
        navigate(AppRoutes.login);
      },
      onError: (error) => {
        // Handle error (e.g., show error message)
        console.error('Logout failed:', error);
      },
    });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
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

          <Typography variant="body1">user.description?</Typography>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" flexDirection="column" gap={1} mb={2}>
            <Box display="flex" alignItems="center">
              <EmailIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {t('email')}: {user?.email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <SchoolIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">{t('school')}: user.school?</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CalendarIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">{t('memberSince')}: user.createdAt?</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <List sx={{ width: '48%' }}>
              <ListItem component="button" onClick={() => handleDeleteAccount()}>
                <ListItemIcon>
                  <DeleteIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={t('deleteAccount')} />
              </ListItem>
            </List>
            <Divider orientation="vertical" flexItem />
            <List sx={{ width: '48%' }}>
              <ListItem component="button" onClick={() => handleLogout()}>
                <ListItemIcon>
                  <ExitToAppIcon color="action" />
                </ListItemIcon>
                <ListItemText primary={t('logout')} />
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ProfilePage;
