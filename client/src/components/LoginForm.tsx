import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import EmailTextField from './textfields/EmailTextField';
import PasswordTextField from './textfields/PasswordTextField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { ClassRoleEnum } from '../util/types/class.types';
import { IsStudentSwitch } from './IsStudentSwitch';

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isStudent, setIsStudent] = useState<boolean>(true);

  const loginMutation = useLogin();

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    loginMutation.mutate(
      {
        email: data.get('email') as string,
        password: data.get('password') as string,
        role: isStudent ? ClassRoleEnum.STUDENT : ClassRoleEnum.TEACHER, //TODO: Change this to the correct role
      },
      {
        onSuccess: () => {
          // Redirect to the home page
          navigate('/');
        },
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 3 }}>
      <EmailTextField email={email} setEmail={setEmail} />
      <PasswordTextField password={password} setPassword={setPassword} />
      <IsStudentSwitch isStudent={isStudent} setIsStudent={setIsStudent} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t('login')}
      </Button>
    </Box>
  );
}

export default LoginForm;
