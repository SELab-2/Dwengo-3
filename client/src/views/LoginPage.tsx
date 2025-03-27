import { useTranslation } from 'react-i18next';
import { Button, Container, Divider, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { GoogleLogin } from '@react-oauth/google';
import { MarginSize } from '../util/size';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register'); // Redirect to the register page
  };

  function handleSuccess() {
    // TODO: handle the api call

    // Redirect to the home page
    navigate('/');
  }

  function handleError() {
    throw new Error('Login failed');
  }

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
          <Divider sx={{ mb: MarginSize.xsmall }} />
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap></GoogleLogin>
          <Divider sx={{ mt: MarginSize.xsmall }} />
          <Typography variant="h6">{t('or')} </Typography>
          <Divider />
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
