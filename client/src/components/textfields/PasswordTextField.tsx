import { useTranslation } from 'react-i18next';
import CustomTextField from './CustomTextField';

function PasswordTextField({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (password: string) => void;
}) {
  const { t } = useTranslation();

  return <CustomTextField value={password} setValue={setPassword} translation={t('password')} />;
}

export default PasswordTextField;
