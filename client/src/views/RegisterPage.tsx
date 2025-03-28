import { Container, Divider, Paper, Typography } from '@mui/material';
import RegisterForm from '../components/RegisterForm';
import { useTranslation } from 'react-i18next';
import { MarginSize } from '../util/size';

function RegisterPage() {
  const { t } = useTranslation();

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {t('register')}
          </Typography>
          <Divider sx={{ mt: MarginSize.xsmall }} />
          <RegisterForm />
        </Paper>
      </Container>
    </>
  );
}

export default RegisterPage;
