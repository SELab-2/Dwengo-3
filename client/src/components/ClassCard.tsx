import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Class as ClassIcon, Person as PersonIcon } from '@mui/icons-material';
import { ClassRoleEnum, PopulatedClass } from '../util/interfaces/class.interfaces';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PopulatedAssignment } from '../util/interfaces/assignment.interfaces';
import { useAuth } from '../hooks/useAuth';
import { sortDeadlines } from '../hooks/useAssignment';
import { getProgress } from '../util/helpers/assignment.helper';
import { IconSize } from '../util/size';

function ClassCard({ classDetails }: { classDetails: PopulatedClass }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const assignments = classDetails.assignments as PopulatedAssignment[];

  // Sort assignments by deadline
  sortDeadlines(assignments);

  // Calculate the progress for a specific learning path and user
  const getProgressOfAssignment = (assignment: PopulatedAssignment) => {
    if (user?.role === ClassRoleEnum.STUDENT) {
      return getProgress({ assignment, studentId: user?.student?.id });
    } else {
      // For a teacher, calculate the progress based on all groups in the class
      const totalProgress = assignment.groups.reduce((acc, group) => {
        return acc + getProgress({ assignment, group });
      }, 0);

      const totalGroups = assignment.groups.length;

      return Math.round(totalProgress / totalGroups);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        borderRadius: 2,
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6,
          transition: 'box-shadow 0.3s ease-in-out',
        },
      }}
      onClick={() => navigate(AppRoutes.class(classDetails.id))}
    >
      <CardContent>
        {/* Header with class name and teacher */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 2,
              height: isMobile ? IconSize.large : IconSize.xlarge,
              width: isMobile ? IconSize.large : IconSize.xlarge,
            }}
          >
            <ClassIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              {classDetails.name}
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {classDetails.teachers[0].user.name + ' ' + classDetails.teachers[0].user.surname}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Learning paths list */}
        <List disablePadding>
          {assignments.slice(0, 2).map((assignment, index) => {
            const progress = getProgressOfAssignment(assignment);

            return (
              <React.Fragment key={index}>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemText
                    primary={
                      <Typography
                        component="div" // Render Typography as a <div> instead of a <p>
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                      >
                        <Typography fontWeight="medium" component="span">
                          {assignment.learningPath.title}
                        </Typography>
                        <Chip
                          label={new Date(assignment.deadline).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    }
                    secondary={
                      <Typography component="div" sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 1,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" component="span">
                          {`${progress}% completed`}
                        </Typography>
                      </Typography>
                    }
                  />
                </ListItem>
                {index < assignments.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
          {assignments.length === 0 && (
            <Box
              sx={{
                height: 120, // Reserve space equivalent to 2 learning paths
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {t('noAssignments')}
              </Typography>
            </Box>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default ClassCard;
