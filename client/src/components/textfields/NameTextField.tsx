import { useTranslation } from 'react-i18next';
import CustomTextField from './CustomTextField';

function NameTextField({ name, setName }: { name: string; setName: (name: string) => void }) {
  const { t } = useTranslation();

  return <CustomTextField value={name} setValue={setName} translation={t('name')} />;
}

export default NameTextField;
