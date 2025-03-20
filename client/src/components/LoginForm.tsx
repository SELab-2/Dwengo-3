import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import EmailTextField from './textfields/EmailTextField';
import PasswordTextField from './textfields/PasswordTextField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    // TODO: API call to login
    // Redirect to the home page
    navigate('/');
  };

  return (
    <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 3 }}>
      <EmailTextField email={email} setEmail={setEmail} />
      <PasswordTextField password={password} setPassword={setPassword} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t('login')}
      </Button>
    </Box>
  );
}

export default LoginForm;
