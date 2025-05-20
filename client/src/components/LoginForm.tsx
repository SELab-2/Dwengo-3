import React, { useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import EmailTextField from './textfields/EmailTextField';
import PasswordTextField from './textfields/PasswordTextField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLogin } from '../hooks/useAuth';
import { ClassRoleEnum } from '../util/interfaces/class.interfaces';
import { useError } from '../hooks/useError';
import { MarginSize } from '../util/size';
import { AppRoutes } from '../util/app.routes';
import { UserDetail } from '../util/interfaces/user.interfaces';
import GoogleButton from './GoogleButton';
import { ChooseRole } from './ChooseRole';

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setError } = useError();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<ClassRoleEnum | null>(null);

  const loginMutation = useLogin();

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!role) {
      setError(t('selectRole'));
      return;
    }

    loginMutation.mutate(
      {
        email: email,
        password: password,
        role: role,
      },
      {
        onSuccess: (response: UserDetail) => {
          // Set the user in the auth context
          login(response);

          // Redirect to the home page
          navigate(AppRoutes.home);
        },
        onError: (error: any) => {
          setError(
            error?.response?.data?.message || error?.message || t('errorSendingErrorMessage'),
          );
        },
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleLoginSubmit}>
      <ChooseRole role={role} setRole={setRole} />
      <Divider />
      <EmailTextField email={email} setEmail={setEmail} />
      <PasswordTextField password={password} setPassword={setPassword} />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: MarginSize.tiny, mb: MarginSize.xsmall }}
        disabled={role === null}
      >
        {t('login')}
      </Button>
      <GoogleButton role={role} label={t('loginWithGoogle')}></GoogleButton>
    </Box>
  );
}

export default LoginForm;
