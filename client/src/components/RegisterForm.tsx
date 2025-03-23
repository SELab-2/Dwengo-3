import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import EmailTextField from './textfields/EmailTextField';
import PasswordTextField from './textfields/PasswordTextField';
import NameTextField from './textfields/NameTextField';
import SurnameTextField from './textfields/SurnameTextField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth, useRegister } from '../hooks/useAuth';
import { ClassRoleEnum } from '../util/types/class.types';
import { IsStudentSwitch } from './IsStudentSwitch';
import { useError } from '../hooks/useError';

function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setError } = useError();
  const { register } = useAuth();

  const registerMutation = useRegister();

  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isStudent, setIsStudent] = useState<boolean>(false);

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    registerMutation.mutate(
      {
        username: ((data.get('name') as string) +
          data.get('surname')) as string,
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        email: data.get('email') as string,
        password: data.get('password') as string,
        role: isStudent ? ClassRoleEnum.STUDENT : ClassRoleEnum.TEACHER,
      },
      {
        onSuccess: (response) => {
          // Update the user context
          register(response);

          // Redirect to the home page
          navigate('/');
        },
        onError: (error) => setError(error.message),
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 3 }}>
      <SurnameTextField surname={name} setSurname={setName} />
      <NameTextField name={surname} setName={setSurname} />
      <EmailTextField email={email} setEmail={setEmail} />
      <PasswordTextField password={password} setPassword={setPassword} />
      <Typography variant="h6" gutterBottom>
        {t('registerAs')}
      </Typography>
      <IsStudentSwitch isStudent={isStudent} setIsStudent={setIsStudent} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t('register')}
      </Button>
      <Typography variant="body2" color="textSecondary" align="center">
        {t('alreadyHaveAccount')}{' '}
      </Typography>
      <a href="/login">{t('login')}</a>
    </Box>
  );
}

export default RegisterForm;
