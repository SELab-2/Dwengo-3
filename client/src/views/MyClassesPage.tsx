import { Box, Button, Divider, Grid2, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { useClasses, useClassesByIds } from '../hooks/useClass';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '../util/routes';
import { ClassShort } from '../util/types/class.types';
import ClassCard from '../components/ClassCard';

function MyClassesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const studentId = user?.student?.id;
  const teacherId = user?.teacher?.id;

  const { data: paginatedData } = useClasses(studentId, teacherId);

  // TODO: How to handle the paginated data?
  const classes = paginatedData?.data ?? [];

  // Fetch the details of the classes using their IDs
  const classesDetails =
    useClassesByIds(classes?.map((classShort: ClassShort) => classShort.id) ?? []).data ?? [];

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
          marginBottom: MarginSize.xsmall, // Add spacing below the row
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

      <Divider sx={{ width: '100%', mb: MarginSize.xsmall }} />

      {/* Grid containing the classes of the current user */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Center the grid horizontally
          width: '100%',
        }}
      >
        {/* Show a label if there are no classes */}
        {classesDetails.length === 0 && (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
            {t('noClasses')}
          </Typography>
        )}

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
