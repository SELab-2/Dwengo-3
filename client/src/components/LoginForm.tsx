import React, { useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import EmailTextField from './textfields/EmailTextField';
import PasswordTextField from './textfields/PasswordTextField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLogin } from '../hooks/useAuth';
import { ClassRoleEnum } from '../util/types/class.types';
import { IsStudentSwitch } from './IsStudentSwitch';
import { useError } from '../hooks/useError';
import { MarginSize } from '../util/size';
import { ApiRoutes, AppRoutes } from '../util/routes';
import { UserDetail } from '../util/types/user.types';
import GoogleLoginButton from './GoogleLoginButton';

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setError } = useError();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isStudent, setIsStudent] = useState<boolean>(false);

  const loginMutation = useLogin();

  const handleGoogleLogin = () => {
    // Redirect to the Google login page
    window.location.href =
      import.meta.env.VITE_API_URL +
      (isStudent ? ApiRoutes.login.google.student : ApiRoutes.login.google.teacher);
  };

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
        onSuccess: (response: UserDetail) => {
          // Set the user in the auth context
          login(response);

          // Redirect to the home page
          navigate(AppRoutes.home);
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 0 }}>
      <IsStudentSwitch isStudent={isStudent} setIsStudent={setIsStudent} />
      <Divider sx={{ mb: MarginSize.xsmall }} />
      <GoogleLoginButton onClick={handleGoogleLogin}></GoogleLoginButton>
      <Divider sx={{ mt: MarginSize.xsmall }} />
      <EmailTextField email={email} setEmail={setEmail} />
      <PasswordTextField password={password} setPassword={setPassword} />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: MarginSize.tiny, mb: MarginSize.xsmall }}
      >
        {t('login')}
      </Button>
    </Box>
  );
}

export default LoginForm;
