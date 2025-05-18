import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ClassRoleEnum } from '../util/interfaces/class.interfaces';

export function ChooseRole({
  role,
  setRole,
}: {
  role: ClassRoleEnum | null;
  setRole: (role: ClassRoleEnum) => void;
}) {
  const { t } = useTranslation();

  return (
    <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
      <RadioGroup
        row
        value={role}
        onChange={(e) => {
          setRole(e.target.value as ClassRoleEnum);
        }}
      >
        <FormControlLabel value={ClassRoleEnum.STUDENT} control={<Radio />} label={t('student')} />
        <FormControlLabel value={ClassRoleEnum.TEACHER} control={<Radio />} label={t('teacher')} />
      </RadioGroup>
    </Box>
  );
}
