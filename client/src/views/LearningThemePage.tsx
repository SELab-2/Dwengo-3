import { Box, Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { MarginSize } from '../util/size';
import { Link, useParams } from 'react-router-dom';
import theme from '../util/theme';
import { AppRoutes } from '../util/app.routes';
import { useLearningPath } from '../hooks/useLearningPath';
import { useState } from 'react';

const themeKeywordsMap = {
  'AI in Climate': ['AI', 'Climate'],
  'Social Robot': ['Robotics', 'AI'],
  'AI in Healthcare': ['AI', 'Healthcare'],
  'Language Technology': ['Language', 'AI'],
};

function LearningPathsOverviewPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useLearningPath(
    themeKeywordsMap[id as keyof typeof themeKeywordsMap],
    // TODO: Add functionality in component to filter on ages
    undefined,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <Box sx={{ p: MarginSize.large, maxHeight: '80vh', overflowY: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
        }}
      >
        {data!.data.map(({ id, title, image, description, targetAges }, index) => (
          <Card
            key={id}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              bgcolor: String(
                Object.values(theme.palette.custom)[
                  index % Object.values(theme.palette.custom).length
                ],
              ),
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Link
              to={AppRoutes.learningPath(id)}
              style={{ textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar
                src={image}
                variant="square"
                sx={{ width: '100%', height: 150, objectFit: 'cover' }}
              />
            </Link>

            <Link
              to={AppRoutes.learningPath(id)}
              style={{ textDecoration: 'none', position: 'absolute', top: 3, right: 3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'black',
                  borderRadius: '8px',
                  borderColor: 'black',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <GroupIcon sx={{ fontSize: 16 }} /> {targetAges?.join(' - ') || 'N/A'}
              </Box>
            </Link>

            <Box sx={{ p: 2, color: 'white' }}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
            </Box>

            <CardContent>
              <ExpandableDescription description={description} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

function ExpandableDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const shortDescription =
    description.length > 100 ? description.slice(0, 97) + '...' : description;

  return (
    <>
      <Typography variant="body2">{expanded ? description : shortDescription}</Typography>
      {description.length > 100 && (
        <Button
          size="small"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation on click, so that it only expands the description
            e.stopPropagation(); // Prevent click bubbling
            setExpanded(!expanded);
          }}
          sx={{ color: 'white' }}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </>
  );
}

export default LearningPathsOverviewPage;
