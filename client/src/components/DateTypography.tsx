import { SxProps, Theme, Typography, TypographyVariant } from '@mui/material';
import { useTranslation } from 'react-i18next';

function DateTypography({
  text,
  date,
  variant,
  sx
}: {
  text?: string;
  date: Date;
  variant?: TypographyVariant;
  sx?: SxProps<Theme>
}) {
  const { i18n } = useTranslation();

  const formattedDate = Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);

  return (
    <Typography variant={variant} gutterBottom sx={sx}>
      {`${text ? text : ''}${formattedDate}`}
    </Typography>
  );
}

export default DateTypography;
