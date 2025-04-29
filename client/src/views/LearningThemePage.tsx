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

function LearningPathsOverviewPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1); // Track current page
  const [learningPaths, setLearningPaths] = useState<LearningPathShort[]>([]); // Store all loaded paths
  const { data: learningTheme } = useLearningThemeById(id);
  const { data, isLoading, isError, error } = useLearningPath(
    learningTheme?.keywords,
    undefined,
    page,
    10,
  );

  useEffect(() => {
    if (data?.data?.length ?? 0 > 0) {
      if (page === 1) {
        // React keeps the state across page navigation, so when we go back to this page,
        // we need to reset the learningPaths state.
        setLearningPaths([]);
      }

      setLearningPaths((prevPaths) => [...prevPaths, ...(data?.data ?? [])]);
    }
  }, [data]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()); // Use a Set for multiple expanded IDs

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment page number to load more data
  };

  const handleToggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newExpandedIds = new Set(prev);
      if (newExpandedIds.has(id)) {
        newExpandedIds.delete(id); // If already expanded, collapse it
      } else {
        newExpandedIds.add(id); // If collapsed, expand it
      }
      return newExpandedIds;
    });
  };

  if (isLoading && page === 1) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data) return <div>No data available</div>;
  console.log('test');
  if (learningPaths.length === 0) {
    return <div>No learningpaths available for this theme...</div>;
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
    <Box sx={{ p: MarginSize.large, maxHeight: '80vh', overflowY: 'auto' }}>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} // Responsive columns
        spacing={3}
      >
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
              <ExpandableDescription
                id={id}
                description={description}
                expanded={expandedIds.has(id)} // Check if this ID is in the set of expanded IDs
                onToggle={() => handleToggleExpanded(id)}
              />
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

type ExpandableDescriptionProps = {
  id: string;
  description: string;
  expanded: boolean;
  onToggle: () => void;
};

function ExpandableDescription({ description, expanded, onToggle }: ExpandableDescriptionProps) {
  const shortDescription =
    description.length > 100 ? description.slice(0, 97) + '...' : description;

  return (
    <>
      <Typography variant="body2">{expanded ? description : shortDescription}</Typography>
      {description.length > 100 && (
        <Button
          size="small"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
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
