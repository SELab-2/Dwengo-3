import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { useTranslation } from 'react-i18next';
import GroupListDialog from '../components/GroupListDialog';
import { useState } from 'react';
import BackButton from '../components/BackButton.tsx';
import { useClassById } from '../hooks/useClass.ts';
import { MarginSize } from '../util/size.ts';
import { useAssignmentById } from '../hooks/useAssignment.ts';
import { AppRoutes } from '../util/app.routes.ts';
import DateTypography from '../components/DateTypography.tsx';

const calculateProgress = (
  progress: number[],
  learningPath: any /* TODO add type when interface is correct*/,
) => {
  const total_nodes = learningPath.learningPathNodes.length;
  // + 1 is added because of zero indexing
  return progress.length > 0 ? ((Math.max(...progress) + 1) / total_nodes) * 100 : 0;
};

function ClassAssignmentPage() {
  const { classId, assignmentId } = useParams<{ classId: string; assignmentId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const { data: classData, isLoading: isLoadingClass } = useClassById(classId!);
  const { data: assignment, isLoading: isLoadingAssignment } = useAssignmentById(assignmentId!);
  if (isLoadingAssignment) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
        {t('loading')}
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {isLoadingClass ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
          {t('loading')}
        </Typography>
      ) : (
        <ClassNavigationBar id={classData!.id} className={classData!.name} />
      )}

      <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%', sm: 1000 }, p: 2 }}>
        <BackButton link={`/class/${classData!.id}/assignments`} />

        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="h3">{assignment!.name}</Typography>

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
              {t('givenBy')}: {assignment!.teacher.user.name} {assignment!.teacher.user.surname}
            </Typography>

            {/* Description content */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t('description')}
            </Typography>
            <Typography variant="body1">{assignment!.description}</Typography>
            <br />
            {
              assignment!.deadline && (
                <DateTypography 
                  text={`${t('deadline')}: `} 
                  date={new Date(assignment!.deadline!)} 
                  variant='subtitle2' 
                  sx={{
                    position: 'absolute',
                    right: 12,
                    bottom: 8,
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  }}
                  />
              )
            }
          </Box>
        </Stack>
        {/*<DateTypography text={`${t('deadline')}: `} date={assignment.deadline} variant='h5' />*/}

        <GroupListDialog
          students={assignment?.groups[selectedGroupIndex]?.students ?? []}
          open={open}
          onClose={() => setOpen(false)}
        />

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            maxHeight: 450,
            overflow: 'auto',
            boxShadow: 3,
            mx: 'auto',
            width: '100%',
            maxWidth: { xs: '90%', sm: 1000 },
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  backgroundColor: 'white',
                  borderBottom: '2px solid #ddd',
                }}
              >
                <TableCell sx={{ minWidth: 180, width: '50%' }}>
                  <Typography variant="h6">{t('name')}</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 200, width: '50%' }}>
                  <Typography variant="h6">{t('progress')}</Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {assignment!.groups.map((group, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: { xs: '14px', sm: '16px' },
                      }}
                      onClick={() => {
                        setSelectedGroupIndex(index);
                        setOpen(true);
                      }}
                    >
                      {group.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(group.progress, assignment!.learningPath)}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        minWidth: { xs: '80px', sm: '150px', md: '200px' },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '5px 10px', sm: '8px 16px' },
                        minWidth: { xs: '60px', sm: '100px' },
                      }}
                      onClick={() => navigate(AppRoutes.learningPath(assignment?.learningPath.id!, group.id))}
                    >
                      {t('details')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default ClassAssignmentPage;
