import { Box, Button, Grid2, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { useClass, useClassesByIds } from '../hooks/useClass';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '../util/routes';
import { ClassShort } from '../util/types/class.types';
import ClassCard from '../components/ClassCard';

function MyClassesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const studentId = user?.student?.id;
  const teacherId = user?.teacher?.id;

  // Call useClass only when studentId or teacherId exists
  const { data: paginatedData } = useClass(studentId, teacherId);

  const classes = paginatedData?.data ?? [];

  const classesDetails =
    useClassesByIds(classes?.map((classShort: ClassShort) => classShort.id) ?? []).data ?? [];

  console.log(classesDetails);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        margin: MarginSize.large,
      }}
    >
      {/* Title and Button Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Space between title and button
          alignItems: 'center',
          width: '100%', // Full width of the container
          marginBottom: MarginSize.medium, // Add spacing below the row
        }}
      >
        <Typography variant="h4" sx={{ textAlign: 'left' }}>
          {t('myClasses')}
        </Typography>
        {user?.teacher && (
          <Button
            href={AppRoutes.classCreate}
            variant="contained"
            sx={{
              textTransform: 'none',
            }}
          >
            {t('createClass')}
          </Button>
        )}
      </Box>

      {/* Grid containing the classes of the current user */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Center the grid horizontally
          width: '100%',
        }}
      >
        <Grid2 container spacing={3} justifyContent="center">
          {classesDetails.map((classDetails) => (
            <ClassCard key={classDetails.id} classDetails={classDetails}></ClassCard>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
}

export default MyClassesPage;
