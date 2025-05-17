import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import React from 'react';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { FavoriteShort } from '../util/interfaces/favorite.interfaces';
import DateTypography from './DateTypography';

const calculateProgress = (
  userId: string,
  assignment?: AssignmentShort2,
  favorite?: FavoriteShort,
) => {
  if (assignment) {
    // find out which group the user is in and retreive the group progress
    const group = assignment.groups.find((group) =>
      group.students.some((student) => student.userId === userId),
    );
    if (group) {
      if (group.progress.length === 0) {
        return 0;
      }

      return (
        ((Math.max(...group.progress) + 1) / assignment.learningPath.learningPathNodes.length) * 100
      );
    }
  } else if (favorite && favorite.progress) {
    return (
      ((Math.max(...favorite.progress) + 1) / favorite.learningPath.learningPathNodes.length) * 100
    );
  }

  // calculate the progress based on assignment and favorite
  // TODO
  return 50;
};

function LearningPathCard({
  assignment,
  favorite,
  actionButtons,
  visualizeProgress,
  userId = '',
}: {
  assignment?: AssignmentShort2;
  favorite?: FavoriteShort;
  actionButtons: React.ReactNode;
  visualizeProgress: boolean;
  userId?: string;
}) {
  return (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">
          {assignment ? assignment.name : favorite ? favorite.learningPath.title : ''}
        </Typography>
      </Box>
      {assignment
        ? assignment.class.name && (
            <Typography variant="body2" color="blue">
              {assignment.class.name}
            </Typography>
          )
        : null}
      {assignment
        ? assignment.deadline && <DateTypography date={new Date(assignment.deadline!)} />
        : null}

      {visualizeProgress && (
        <LinearProgress
          variant="determinate"
          value={calculateProgress(userId, assignment, favorite)}
          sx={{ flex: 2, height: 8, borderRadius: 5 }}
        />
      )}
      {actionButtons}
    </Paper>
  );
}

export default LearningPathCard;
