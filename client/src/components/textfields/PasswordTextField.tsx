import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function PasswordTextField({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (password: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label={t('password')}
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  );
}

export default PasswordTextField;
