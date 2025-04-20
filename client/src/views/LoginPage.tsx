import { useTranslation } from 'react-i18next';
import { Button, Container, Divider, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { MarginSize } from '../util/size';
import { AppRoutes } from '../util/app.routes';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate(AppRoutes.register); // Redirect to the register page
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {t('welcomeMessage')}
          </Typography>
          <Divider sx={{ mb: MarginSize.tiny }} />
          <LoginForm />
          <Divider sx={{ mb: MarginSize.xsmall }} />
          <Button fullWidth variant="outlined" color="primary" onClick={handleRegisterClick}>
            {t('register')}
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export { LoginPage };
