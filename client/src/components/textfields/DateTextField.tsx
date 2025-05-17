import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/nl';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import { useEffect, useState } from 'react';
import { enUS, frFR, nlNL } from '@mui/x-date-pickers/locales';

dayjs.extend(utc);
dayjs.extend(timezone);

function DateTextField({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: (date: Date | null) => void;
}) {
  const { t, i18n } = useTranslation();
  const [localText, setLocalText] = useState(nlNL);

  useEffect(() => {
    switch (i18n.language) {
      case 'nl':
        setLocalText(nlNL);
        break;
      case 'fr':
        setLocalText(frFR);
        break;
      case 'en':
      default:
        setLocalText(enUS);
        break;
    }
  }, [i18n.language]);
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language}
      localeText={localText.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <DateTimePicker
        timezone="system"
        label={t('deadline')}
        sx={{ mt: 2, width: '100%' }}
        minDateTime={dayjs()}
        timeSteps={{ minutes: 1 }}
        value={date ? dayjs(date) : null}
        onChange={(newValue) => {
          if (newValue) {
            setDate(newValue.toDate());
          } else {
            setDate(null);
          }
        }}
      />
    </LocalizationProvider>
  );
}

export default DateTextField;
