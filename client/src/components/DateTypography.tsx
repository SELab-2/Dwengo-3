import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function DateTypography({ text, date }: { text?: string; date: Date }) {
  const { i18n } = useTranslation();

  const formattedDate = Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);

  return (
    <Typography variant="h5" gutterBottom>
      {`${text}${formattedDate}`}
    </Typography>
  );
}

export default DateTypography;
