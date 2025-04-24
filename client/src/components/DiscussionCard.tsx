import { Card, CardContent, Typography } from '@mui/material';

interface DiscussionCardProps {
  discussion: {
    title: string;
    content: string;
    author?: string;
    createdAt?: string;
  };
}

function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {discussion.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {discussion.content}
        </Typography>
        {discussion.author && (
          <Typography variant="caption" color="text.secondary">
            {discussion.author}
          </Typography>
        )}
        {discussion.createdAt && (
          <Typography variant="caption" color="text.secondary" sx={{ float: 'right' }}>
            {new Date(discussion.createdAt).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default DiscussionCard;
