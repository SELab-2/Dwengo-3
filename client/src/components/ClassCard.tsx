import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import { Class as ClassIcon, Person as PersonIcon } from '@mui/icons-material';
import { LearningPathDetail } from '../util/types/learningPath.types';

interface ClassGroupCardProps {
  className: string;
  teacherName: string;
  learningPaths: LearningPathDetail[];
}

const ClassGroupCard: React.FC<ClassGroupCardProps> = ({
  className,
  teacherName,
  learningPaths,
}) => {
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
    >
      <CardContent>
        {/* Header with class name and teacher */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <ClassIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              {className}
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {teacherName}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Learning paths list */}
        <List disablePadding>
          {learningPaths.slice(0, 2).map((path, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight="medium">{path.title}</Typography>
                      <Chip
                        label={'10/03/2025'}
                        /* TODO: replace with actual value */ size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <LinearProgress
                        variant="determinate"
                        value={10} //TODO: replace with actual progress value
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          mb: 1,
                        }}
                      />
                      {/* TODO: replace with actual progress value */}
                      <Typography variant="caption" color="text.secondary">
                        {`${10}% completed`}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < learningPaths.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ClassGroupCard;
