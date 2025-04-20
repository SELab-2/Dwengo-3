import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

interface MessageCardProps {
  id: string;
  content: string;
  sender: {
    id: string;
    surname: string;
    name: string;
    role: string;
  };
  discussionId: string;
  createdAt: Date;
}

const MessageCard = ({ id, content, sender, discussionId, createdAt }: MessageCardProps) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: theme.palette.primary.main,
          padding: 1.2,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {sender.surname} {sender.name}
          </Typography>
          <Typography variant="subtitle1" color={theme.palette.text.secondary}>
            {sender.role === 'STUDENT' ? 'Student' : 'Teacher'}
          </Typography>
        </Box>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          {createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString()}
        </Typography>
      </Box>
      <CardContent sx={{ bgcolor: '#fffde7' }}>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
};
export default MessageCard;
