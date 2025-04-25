import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import { TeacherShort } from '../util/interfaces/teacher.interfaces';

interface AnnouncementCardProps {
  id: string;
  title: string;
  //date: string;
  teacher: TeacherShort;
  content: string;
  // actionButtons: React.ReactNode;
}

// TODO : use colorSchema for colors
const AnnouncementCard = ({
  id,
  title,
  //date,
  teacher,
  content,
  // actionButtons,  /* TODO: This is needed to place an edit button on the card when on the detail page and when the user is a teacher */
}: AnnouncementCardProps) => {
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
          {/* no possible way to get date from backend
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {date}
          </Typography>
          */}
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
