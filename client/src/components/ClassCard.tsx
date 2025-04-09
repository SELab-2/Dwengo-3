import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Avatar,
  List,
  ListItem,
  Chip,
  LinearProgress,
  ListItemText,
} from '@mui/material';
import { Class as ClassIcon, Person as PersonIcon } from '@mui/icons-material';
import { ClassDetail } from '../util/types/class.types';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import React from 'react';
import { useTranslation } from 'react-i18next';

function ClassCard({
  classDetails,
  // TODO: include assignments
}: {
  classDetails: ClassDetail;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // TODO: replace with actual learning paths
  let learningPaths = [
    { title: 'Learning Path 1', deadline: '10/03/2025', progress: 40 },
    { title: 'Learning Path 2', deadline: '25/04/2025', progress: 65 },
  ];

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
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
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
          {learningPaths.slice(0, 2).map((path, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText
                  primary={
                    <Typography
                      component="div" // Render Typography as a <div> instead of a <p>
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography fontWeight="medium" component="span">
                        {path.title}
                      </Typography>
                      <Chip
                        label={path.deadline} /* TODO: replace with actual value */
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  }
                  secondary={
                    <Typography
                      component="div" // Render Typography as a <div> instead of a <p>
                      sx={{ mt: 1 }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={path.progress} //TODO: replace with actual progress value
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          mb: 1,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" component="span">
                        {`${path.progress}% completed`}
                      </Typography>
                    </Typography>
                  }
                />
              </ListItem>
              {index < learningPaths.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {learningPaths.length === 0 && (
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
