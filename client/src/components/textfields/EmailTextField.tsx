import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function EmailTextField({ email, setEmail }: { email: string; setEmail: (email: string) => void }) {
  const { t } = useTranslation();

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id="email"
      label={t('email')}
      type="email"
      name="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}

export default EmailTextField;
