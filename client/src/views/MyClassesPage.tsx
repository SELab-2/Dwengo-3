import { Box, Grid2, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import ClassGroupCard from '../components/ClassCard';
import { useTranslation } from 'react-i18next';
import { useClass } from '../hooks/useClass';
import { ClassRoleEnum } from '../util/types/class.types';
import { useStudent, useTeacher } from '../hooks/useUser';
import { en } from '../util/locale/en';

function MyClassesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  let classes;

  if (user?.role === ClassRoleEnum.STUDENT) {
    const { data: student } = useStudent(user?.id);
    classes = useClass(student?.id, undefined).data;
  } else {
    // Fetch teacher data only if the user is a teacher and the user ID is available
    const { data: teacher } = useTeacher(user?.id);
    classes = useClass(undefined, teacher?.id).data;
  }

  console.log('classes', classes);

  return (
    <Box
      sx={{
        justifyContent: 'center',
        display: 'flex',
        height: '100%',
        mt: MarginSize.large,
      }}
    >
      <Typography variant="h4">My Classes of {user?.name ?? 'Nobody'}</Typography>

      {/* Grid containing the classes of the current user*/}
      <Grid2 container spacing={3}></Grid2>
    </Box>
  );
}

export default MyClassesPage;
