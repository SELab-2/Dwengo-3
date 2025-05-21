import React, { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import EmailTextField from './textfields/EmailTextField';
import PasswordTextField from './textfields/PasswordTextField';
import NameTextField from './textfields/NameTextField';
import SurnameTextField from './textfields/SurnameTextField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth, useRegister } from '../hooks/useAuth';
import { ClassRoleEnum } from '../util/interfaces/class.interfaces';
import { ChooseRole } from './ChooseRole';
import { useError } from '../hooks/useError';
import { MarginSize } from '../util/size';
import { AppRoutes } from '../util/app.routes';
import GoogleButton from './GoogleButton';

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
  const [role, setRole] = useState<ClassRoleEnum | null>(null);

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!role) {
      setError(t('selectRole'));
      return;
    }

    registerMutation.mutate(
      {
        username: name.toLowerCase() + '_' + surname.toLowerCase(),
        name: name,
        surname: surname,
        email: email,
        password: password,
        role: role!,
      },
      {
        onSuccess: (response) => {
          // Update the user context
          register(response);

          // Redirect to the home page
          navigate(AppRoutes.home);
        },
        onError: (error: any) => {
          setError(error?.response?.data?.message || error?.message || t('undefinedError'));
        },
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: MarginSize.tiny }}>
      <Divider />
      <ChooseRole role={role} setRole={setRole} />
      <Divider />
      <SurnameTextField surname={name} setSurname={setName} />
      <NameTextField name={surname} setName={setSurname} />
      <EmailTextField email={email} setEmail={setEmail} />
      <PasswordTextField password={password} setPassword={setPassword} />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: MarginSize.tiny, mb: 2 }}
        disabled={role === null}
      >
        {t('register')}
      </Button>
      <GoogleButton role={role} label={t('registerWithGoogle')} />
      <Divider sx={{ mb: MarginSize.tiny, mt: MarginSize.xsmall }} />
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: MarginSize.tiny }}>
        {t('alreadyHaveAccount')}{' '}
      </Typography>
      <Button fullWidth variant="outlined" color="primary" href={AppRoutes.login}>
        {t('login')}
      </Button>
    </Box>
  );
}

export default RegisterForm;
