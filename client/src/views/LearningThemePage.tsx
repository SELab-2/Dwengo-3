import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import GroupIcon from '@mui/icons-material/Group';
import { MarginSize } from '../util/size';
import { Link, useParams } from 'react-router-dom';
import theme from '../util/theme';
import { AppRoutes } from '../util/app.routes';
import { useLearningPath } from '../hooks/useLearningPath';
import { useLearningThemeById } from '../hooks/useLearningTheme';
import { useEffect, useState, useMemo } from 'react';
import { LearningPathShort } from '../util/interfaces/learningPath.interfaces';

const getImageSrc = (image: string): string => {
  if (!image) return '';
  if (image.startsWith('data:image')) return image;
  try {
    const url = new URL(image);
    return url.href;
  } catch {
    return `data:image/png;base64,${image}`;
  }
};

function LearningPathsOverviewPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [paths, setPaths] = useState<LearningPathShort[]>([]);

  const { data: learningTheme } = useLearningThemeById(id);
  const { data, isLoading } = useLearningPath(learningTheme?.keywords, undefined, page, 10);

  useEffect(() => {
    setPaths([]);
    setPage(1);
  }, [id]);

  useEffect(() => {
    if (data?.data?.length) {
      setPaths((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Memoize targetAgesRange calculation to prevent unnecessary recalculations
  const targetAgesRange = useMemo(
    () => (index: number) => {
      const nodes = paths[index].learningPathNodes;
      const ages = nodes.flatMap((n) => n.learningObject?.targetAges || []);
      return ages.length === 0 ? 'N/A' : `${Math.min(...ages)} - ${Math.max(...ages)}`;
    },
    [paths],
  );

  if (isLoading && page === 1) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;
  if (paths.length === 0) return <div>No learning paths available for this theme...</div>;

  return (
    <Box
      sx={{
        p: MarginSize.large,
        maxWidth: '70%',
        margin: '0 auto',
        flex: '1 1 auto',
        minHeight: 0,
        height: '70vh',
        overflowY: 'auto',
      }}
    >
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} spacing={3}>
        {paths.map(({ id, title, image, description }, index) => (
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
              display: 'block',
              width: '100%',
            }}
          >
            <Link to={AppRoutes.learningPath(id)} replace style={{ textDecoration: 'none' }}>
              <Box sx={{ width: '100%', display: 'block' }}>
                <img
                  src={getImageSrc(image)}
                  alt={title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </Box>
            </Link>

            <Box
              sx={{
                position: 'absolute',
                top: 3,
                right: 3,
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

      {/* Load More button */}
      {data?.totalPages > page && (
        <Box textAlign="center" mt={3}>
          <Button variant="contained" onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default LearningPathsOverviewPage;
