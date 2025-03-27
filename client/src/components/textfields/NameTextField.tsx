import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function NameTextField({ name, setName }: { name: string; setName: (name: string) => void }) {
  const { t } = useTranslation();

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id="name"
      label={t('name')}
      name="name"
      type="text"
      autoFocus
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}

export default NameTextField;
