import { Card, CardContent, Avatar, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface AnnouncementCardProps {
  title: string;
  date: string;
  teacher: string;
  content: string;
}

// TODO : use colorSchema for colors
const AnnouncementCard = ({ title, date, teacher, content }: AnnouncementCardProps) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', bgcolor: theme.palette.primary.main, p: 2 }}
      >
        {/* Avatar can be replaced with an icon or image */}
        <Avatar sx={{ bgcolor: '#ffffff', color: '#333', mr: 2 }}>😊</Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {date}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="subtitle1" fontWeight="bold">
          {teacher}
        </Typography>
      </Box>
      <CardContent sx={{ bgcolor: '#fffde7' }}>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
