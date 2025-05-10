import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBar, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useClassById } from '../hooks/useClass.ts';
import theme from '../util/theme.ts';
import { MarginSize } from '../util/size.ts';
import { AppRoutes } from '../util/app.routes.ts';
import { UserDataTableComponent } from '../components/UserDataTableComponent.tsx';
import { deleteStudentFromClass, deleteTeacherFromClass, updateClass } from '../api/class.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useError } from '../hooks/useError.ts';
import { LoadingButton } from '@mui/lab';

export function ClassGroupEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { classId } = useParams<{ classId: string }>();
  const {
    data: classData,
    isLoading: isClassDataLoading,
    refetch: refetchClassData,
  } = useClassById(classId!);
  const error = useError();
  const [className, setClassName] = useState<string>('');
  const [classDescription, setClassDescription] = useState<string>('');

  useEffect(() => {
    if (classData) {
      setClassName(classData.name);
      setClassDescription(classData.description);
    }
  }, [classData]);

  return (
    <Box sx={{ width: '100vw' }}>
      <Paper
        elevation={3}
        sx={{
          m: '2% auto',
          borderRadius: 2,
          overflow: 'hidden',
          width: '90%',
        }}
      >
        <AppBar
          position="static"
          sx={{
            p: MarginSize.small,
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            {t('editClass')}
          </Typography>

          <Button
            onClick={() => {
              navigate(AppRoutes.class(classId!));
            }}
            sx={{ color: 'white' }}
          >
            {t('cancel')}
          </Button>
        </AppBar>
      </Paper>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { xs: 'center', md: 'space-evenly' },
          alignItems: 'center',
        }}
      >
        {!isClassDataLoading ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                m: MarginSize.small,
                width: { xs: '80%', md: 'calc(100% / 3)' },
                height: '100%',
              }}
            >
              <TextField
                label={t('className')}
                sx={{ width: '100%' }}
                value={className}
                onChange={(e: any) => setClassName(e.target.value)}
              />
              <TextField
                multiline={true}
                rows={6}
                sx={{ width: '100%' }}
                label={t('classDescription')}
                value={classDescription}
                onChange={(e: any) => setClassDescription(e.target.value)}
              />
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                <Button
                  onClick={async () => {
                    await updateClass(classId!, {
                      name: className,
                      description: classDescription,
                    });
                    navigate(AppRoutes.class(classId!));
                  }}
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {t('save')}
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                width: '100%',
                p: 3,
              }}
            >
              <UserDataTableComponent
                data={classData!!.students.map((student) => {
                  return {
                    id: student.id,
                    name: student.user.name,
                    surname: student.user.surname,
                  };
                })}
                title={t('students')}
                onActionPressed={async (id: string) => await deleteStudentFromClass(classId!!, id)}
              />

              {/* Teachers */}
              <UserDataTableComponent
                data={classData!!.teachers.map((teacher) => {
                  return {
                    id: teacher.id,
                    name: teacher.user.name,
                    surname: teacher.user.surname,
                  };
                })}
                title={t('teachers')}
                onActionPressed={async (id: string) => {
                  if (
                    user!!.teacher &&
                    classData!!.teachers.find((teacher) => teacher.id === user!!.teacher!!.id)
                  ) {
                    error.setError("You can't remove yourself");
                    return;
                  }
                  await deleteTeacherFromClass(classId!!, id);
                }}
              />
            </Box>
          </>
        ) : (
          <Typography>{t('loading')}</Typography>
        )}
      </Box>
    </Box>
  );
}
