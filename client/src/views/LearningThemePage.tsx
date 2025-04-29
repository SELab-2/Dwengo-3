import { Box, Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { MarginSize } from '../util/size';
import { Link, useParams } from 'react-router-dom';
import theme from '../util/theme';
import { AppRoutes } from '../util/app.routes';
import { useLearningPath } from '../hooks/useLearningPath';
import { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import { LearningPathShort } from '../util/interfaces/learningPath.interfaces';
import { useLearningThemeById } from '../hooks/useLearningTheme';

// Helper function to handle image sources (Base64 or URL)
const getImageSrc = (image: string): string => {
  if (!image) return ''; // fallback
  if (image.startsWith('data:image')) return image;
  try {
    const url = new URL(image);
    return url.href;
  } catch {
    // Not a valid URL, assume base64 without prefix
    return `data:image/png;base64,${image}`;
  }
};

function LearningPathsOverviewPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [learningPaths, setLearningPaths] = useState<LearningPathShort[]>([]);
  const { data: learningTheme } = useLearningThemeById(id);
  const { data, isLoading, isError, error } = useLearningPath(
    learningTheme?.keywords,
    undefined,
    page,
    10,
  );

  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    if (data?.data?.length ?? 0 > 0) {
      if (page === 1) {
        setLearningPaths([]);
      }
      setLearningPaths((prevPaths) => [...prevPaths, ...(data?.data ?? [])]);
    }
  }, [data, page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth, naturalHeight } = event.target as HTMLImageElement;
    setImageDimensions({
      width: naturalWidth,
      height: naturalHeight,
    });
  };

  if (isLoading && page === 1) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data) return <div>No data available</div>;

  if (learningPaths.length === 0) {
    return <div>No learning paths available for this theme...</div>;
  }

  const targetAgesRange = (index: number) => {
    const nodes = learningPaths[index].learningPathNodes;
    let ages: number[] = [];

    for (const node of nodes) {
      if (node.learningObject?.targetAges) {
        ages = ages.concat(node.learningObject.targetAges);
      }
    }

    if (ages.length === 0) return 'N/A';

    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);

    return `${minAge} - ${maxAge}`;
  };

  return (
    <Box
      sx={{
        p: MarginSize.large,
        maxWidth: '80%',
        maxHeight: '80vh',
        overflowY: 'auto',
        margin: '0 auto',
      }}
    >
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} spacing={3}>
        {learningPaths.map(({ id, title, image, description }, index) => (
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
              <Box sx={{ position: 'relative' }}>
                <img
                  src={getImageSrc(image)}
                  alt={title}
                  style={{ display: 'none' }}
                  onLoad={handleImageLoad}
                />
                <Avatar
                  src={getImageSrc(image)}
                  variant="square"
                  sx={{
                    width: '100%',
                    height: imageDimensions
                      ? `${(imageDimensions.height / imageDimensions.width) * 100}%`
                      : '150px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
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
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <GroupIcon sx={{ fontSize: 16 }} /> {targetAgesRange(index)}
              </Box>
            </Link>

            <Box sx={{ p: 2, color: 'white' }}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
            </Box>

            <CardContent>
              <Typography variant="body2">{description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Masonry>

      {data.totalPages > page && (
        <Button onClick={handleLoadMore} sx={{ marginTop: 2, width: '100%' }}>
          Load More
        </Button>
      )}
    </Box>
  );
}

export default LearningPathsOverviewPage;
