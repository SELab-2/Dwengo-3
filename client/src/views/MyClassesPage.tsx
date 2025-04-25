import { Box, Button, Grid, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { usePopulatedClasses } from '../hooks/useClass';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '../util/app.routes';
import ClassCard from '../components/ClassCard';
import Paginator from '../components/Paginator';
import { useState } from 'react';

function MyClassesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const studentId = user?.student?.id;
  const teacherId = user?.teacher?.id;

  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch paginated and populated classes
  const { data: paginatedData, isLoading } = usePopulatedClasses(
    studentId,
    teacherId,
    page,
    pageSize,
    {
      populateTeachers: true,
      populateAssignments: true,
      populateAssignmentLearningPaths: true,
    },
  );

  const classes = paginatedData?.data ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;

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
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: MarginSize.xsmall,
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

      {/* Show a loading indicator or a message if no classes are available */}
      {isLoading ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
          {t('loading')}
        </Typography>
      ) : classes.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
          {t('noClasses')}
        </Typography>
      ) : (
        // Paginator Component
        <Paginator
          data={classes}
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          renderItem={(classDetails) => (
            <ClassCard key={classDetails.id} classDetails={classDetails} />
          )}
          renderContainer={(children) => (
            <Grid container spacing={3} justifyContent="center">
              {children}
            </Grid>
          )}
        />
      )}
    </Box>
  );
}

export default MyClassesPage;
