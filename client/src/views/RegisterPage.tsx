import { Container, Paper, Typography, useMediaQuery } from '@mui/material';
import RegisterForm from '../components/RegisterForm';
import { useTranslation } from 'react-i18next';
import { MarginSize } from '../util/size';

function RegisterPage() {
  const { t } = useTranslation();

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: isMobile ? MarginSize.small : MarginSize.large,
            py: isMobile ? 2 : 4,
            px: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {t('register')}
          </Typography>
          <RegisterForm />
        </Paper>
      </Container>
    </>
  );
}

export default RegisterPage;
