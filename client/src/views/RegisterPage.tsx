import { Container, Paper } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: 'center' }}>
          <RegisterForm />
        </Paper>
      </Container>
    </>
  );
}

export default RegisterPage;
