import { Box, Switch, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function IsStudentSwitch({
  isStudent,
  setIsStudent,
}: {
  isStudent: boolean;
  setIsStudent: (isStudent: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Switch checked={isStudent} onChange={() => setIsStudent(!isStudent)} />
      <Typography>{isStudent ? t('student') : t('teacher')}</Typography>
    </Box>
  );
}
