import { Avatar, Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import { TeacherShort } from '../util/interfaces/teacher.interfaces';
import DateTypography from './DateTypography';

interface AnnouncementCardProps {
  id: string;
  title: string;
  date: string;
  teacher: TeacherShort;
  content: string;
}

const AnnouncementCard = ({ id, title, date, teacher, content }: AnnouncementCardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(AppRoutes.announcement(id));
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', bgcolor: theme.palette.primary.main, p: 2 }}
      >
        {/* Avatar can be replaced with an icon or image */}
        <Avatar sx={{ bgcolor: '#ffffff', color: '#333', mr: 2 }}>😊</Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" onClick={handleClick}>
            {title}
          </Typography>
          <DateTypography variant="body2" date={new Date(date)} />
          <Typography variant="subtitle1" fontWeight="bold">
            {teacher.user.name}
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ bgcolor: '#fffde7' }}>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
