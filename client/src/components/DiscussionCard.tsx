import { Box, Card, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/routes';

interface DiscussionCardProps {
  id: string;
}

const DiscussionCard = ({ id }: DiscussionCardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(AppRoutes.discussion(id));
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', bgcolor: theme.palette.primary.main, p: 2 }}
      >
        <Typography variant="h6" fontWeight="bold" onClick={handleClick}>
          Discussion {id}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </Card>
  );
};
export default DiscussionCard;
