import { Box, Switch, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MarginSize } from '../util/size';

export function IsStudentSwitch({
  isStudent,
  setIsStudent,
}: {
  isStudent: boolean;
  setIsStudent: (isStudent: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: MarginSize.tiny }}
    >
      <Switch checked={isStudent} onChange={() => setIsStudent(!isStudent)} />
      <Typography>{isStudent ? t('iAmStudent') : t('iAmTeacher')}</Typography>
    </Box>
  );
}
