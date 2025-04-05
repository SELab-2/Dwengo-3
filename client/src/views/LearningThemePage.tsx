import { Box, Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { MarginSize } from '../util/size';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import theme from '../util/theme';
import { AppRoutes } from '../util/routes';

const themeKeywordsMap = {
  'AI in Climate': ['AI', 'Climate'],
  'Social Robot': ['Robotics', 'AI'],
  'AI in Healthcare': ['AI', 'Healthcare'],
  'Language Technology': ['Language', 'AI'],
};

// TODO: Get data from endpoint
const learningPaths = [
  {
    id: '0',
    title: 'Introduction to AI in Climate',
    targetAges: [12, 13, 14],
    keywords: ['AI', 'Climate'],
    image:
      'https://kattechnical.com/wp-content/uploads/2023/10/AI-and-Climate-Change-Leveraging-Artificial-Intelligence-for-Environmental-Solutions-1024x576.png',
    description:
      'Learn how artificial intelligence is used in climate science to predict changes and mitigate risks. This course covers basics, applications, and real-world impact.',
  },
  {
    id: '2',
    title: 'Social Robots and Human Interaction',
    targetAges: [15, 16, 17],
    keywords: ['Robotics', 'AI'],
    image:
      'https://industrywired.com/wp-content/uploads/2023/12/Social-Robots-Enhancing-Human-Interaction-with-AI-Rahul.jpg',
    description:
      'Discover how social robots are designed to interact with humans and assist in everyday tasks. Includes hands-on projects and ethical considerations.',
  },
  {
    id: '3',
    title: 'AI in Healthcare Innovations',
    targetAges: [18, 19, 20],
    keywords: ['AI', 'Healthcare'],
    image: 'https://industrywired.com/wp-content/uploads/2020/07/Healthcare.jpg',
    description:
      'Explore AI-driven advancements in healthcare, from diagnostics to personalized treatment plans. Case studies and practical applications included.',
  },
  {
    id: '4',
    title: 'Advancements in Language Technology',
    targetAges: [13, 14, 15],
    keywords: ['Language', 'AI'],
    image:
      'https://mysam.ai/wp-content/uploads/2016/05/Advancements-In-GPT-3s-Natural-Language-Processing-Capabilities.jpg',
    description:
      'Understand how AI is revolutionizing language processing, translation, and communication. Hands-on experience with NLP models provided.',
  },
  {
    id: '5',
    title: 'Renewable Energy and Climate Solutions',
    targetAges: [16, 17, 18],
    keywords: ['Climate'],
    image:
      'https://as2.ftcdn.net/v2/jpg/05/75/38/03/1000_F_575380309_Qvvb2M09c8LPpwFAGjebd7mjxDZijFZu.jpg',
    description:
      'Dive into the world of renewable energy sources like solar and wind power. Learn about their role in combating climate change and the latest innovations.',
  },
  {
    id: '6',
    title: 'Ethics in Robotics and Automation',
    targetAges: [14, 15, 16],
    keywords: ['Robotics'],
    image:
      'https://image.slidesharecdn.com/ethicalchallengesforroboticsandautomationengineering-230226104641-16261dec/75/ethical-challenges-for-robotics-and-automation-engineering-pptx-1-2048.jpg',
    description:
      'Investigate the ethical concerns surrounding automation and robotics. Topics include job displacement, bias in AI, and the moral responsibilities of engineers.',
  },
  {
    id: '7',
    title: 'The Human Brain and Language Processing',
    targetAges: [17, 18, 19],
    keywords: ['Language'],
    image:
      'https://omeka-yale-prod.s3.amazonaws.com/large/c2a410e7c366091ffcaab8fb5c9124a5f017a02e.jpg',
    description:
      'Explore how the human brain processes language, how children acquire speech, and how linguistics informs modern AI-based translation tools.',
  },
  {
    id: '8',
    title: 'Medical Breakthroughs in Biotech',
    targetAges: [19, 20, 21],
    keywords: ['Healthcare'],
    image: 'https://journotalk.com/wp-content/uploads/2024/08/img_34-1.webp',
    description:
      'Learn about the latest discoveries in biotechnology, including CRISPR gene editing, lab-grown organs, and advances in disease prevention.',
  },
];

function LearningPathsOverviewPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  // TODO: Fetch learning paths based on the theme ID (or corresponding keywords) from the backend
  const filteredPaths = learningPaths.filter((path) =>
    themeKeywordsMap[id as keyof typeof themeKeywordsMap]?.some((keyword: string) =>
      path.keywords.includes(keyword),
    ),
  );

  return (
    <Box sx={{ p: MarginSize.large, maxHeight: '80vh', overflowY: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
        }}
      >
        {filteredPaths.map(({ id, title, image, description, targetAges }, index) => (
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
                {t(title)}
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
