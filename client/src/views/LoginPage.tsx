import { useTranslation } from 'react-i18next';
import { Box, Button, Container, Divider, Paper, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { MarginSize } from '../util/size';
import { AppRoutes } from '../util/app.routes';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleRegisterClick = () => {
    navigate(AppRoutes.register); // Redirect to the register page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Horizontal centering
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: isMobile ? MarginSize.medium : MarginSize.xlarge,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {t('welcomeMessage')}
          </Typography>
          <Divider />
          <LoginForm />
          <Divider sx={{ mb: MarginSize.xsmall, mt: MarginSize.xsmall }} />
          <Button fullWidth variant="outlined" color="primary" onClick={handleRegisterClick}>
            {t('register')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export { LoginPage };
