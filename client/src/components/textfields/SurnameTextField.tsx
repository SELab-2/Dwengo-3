import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function SurameTextField({
  surname,
  setSurname,
}: {
  surname: string;
  setSurname: (name: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id="surname"
      label={t('surname')}
      name="surname"
      type="text"
      autoFocus
      value={surname}
      onChange={(e) => setSurname(e.target.value)}
    />
  );
}

export default SurameTextField;
