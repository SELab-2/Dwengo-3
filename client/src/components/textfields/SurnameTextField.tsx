import { useTranslation } from 'react-i18next';
import CustomTextField from './CustomTextField';

function SurameTextField({
  surname,
  setSurname,
}: {
  surname: string;
  setSurname: (name: string) => void;
}) {
  const { t } = useTranslation();

  return <CustomTextField value={surname} setValue={setSurname} translation={t('surname')} />;
}

export default SurameTextField;
