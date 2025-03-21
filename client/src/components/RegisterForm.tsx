import React, { useState } from 'react';
import { Box, Button, Switch, Typography } from '@mui/material';
import EmailTextField from './textfields/EmailTextField';
import PasswordTextField from './textfields/PasswordTextField';
import NameTextField from './textfields/NameTextField';
import SurnameTextField from './textfields/SurnameTextField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isStudent, setIsStudent] = useState<boolean>(false);

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      surname: data.get('surname'),
      email: data.get('email'),
      password: data.get('password'),
    });

    if (isStudent) {
      // TODO: Register as a student
    } else {
      // TODO: Register as a teacher
    }

    // Redirect to the home page
    navigate('/');
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
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Switch checked={isStudent} onChange={() => setIsStudent(!isStudent)} />
        <Typography>{isStudent ? t('student') : t('teacher')}</Typography>
      </Box>
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
