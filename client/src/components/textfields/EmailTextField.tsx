import { useTranslation } from 'react-i18next';
import CustomTextField from './CustomTextField';

function EmailTextField({ email, setEmail }: { email: string; setEmail: (email: string) => void }) {
  const { t } = useTranslation();

  return (
    <CustomTextField type="email" value={email} setValue={setEmail} translation={t('email')} />
  );
}

export default EmailTextField;
