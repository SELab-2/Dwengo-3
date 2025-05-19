import { Stack, Typography, Box } from '@mui/material';
import { t } from 'i18next';
import { TeacherShort } from '../util/interfaces/teacher.interfaces';
import DateTypography from './DateTypography';

interface AssignmentInfoCardProps {
  name: string;
  description: string;
  deadline?: string;
  teacher: TeacherShort;
}

const AssignmentInfoCard = ({ name, description, deadline, teacher }: AssignmentInfoCardProps) => {
  return (
    <Stack spacing={3} sx={{ mb: 4 }}>
      <Typography variant="h3">{name}</Typography>

      <Box
        sx={{
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          p: 2,
          boxShadow: 1,
          position: 'relative',
        }}
      >
        {/* Given By - top right */}
        <Typography
          variant="subtitle2"
          sx={{
            position: 'absolute',
            top: 8,
            right: 12,
            fontStyle: 'italic',
            color: 'text.secondary',
          }}
        >
          {t('givenBy')}: {teacher.user.name} {teacher.user.surname}
        </Typography>

        {/* Description content */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          {t('description')}
        </Typography>
        <Typography variant="body1">{description}</Typography>
        <br />
        {deadline && (
          <DateTypography
            text={`${t('deadline')}: `}
            date={new Date(deadline)}
            variant="subtitle2"
            sx={{
              position: 'absolute',
              right: 12,
              bottom: 8,
              fontStyle: 'italic',
              color: 'text.secondary',
            }}
          />
        )}
      </Box>
    </Stack>
  );
};

export default AssignmentInfoCard;
