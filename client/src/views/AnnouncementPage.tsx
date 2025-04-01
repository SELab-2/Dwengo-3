import { useMemo } from 'react';
import { Typography, Box, Button, useTheme } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import AnnouncementCard from '../components/AnnouncementCard';

// TODO: get this data from the api
const announcementsData = [
  {
    id: 1,
    title: 'Begin van schooljaar',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 1',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat. Cras nec ligula convallis, faucibus odio et, sodales purus. Integer aliquam sem ut sollicitudin venenatis. Vivamus cursus magna id pharetra feugiat. Nam tempus ante dui, vel ullamcorper urna gravida id. Duis ac orci sapien. Aliquam id ligula ut orci tincidunt luctus. Nulla facilisi. Nulla tincidunt justo a enim lobortis, ac vestibulum orci facilisis. Phasellus condimentum mi ut augue viverra, in posuere erat consectetur.\n\n' +
      'Ut efficitur tincidunt nulla, sed ultricies orci pharetra sed. Fusce vestibulum ipsum ac sapien dictum, ac rhoncus lorem sollicitudin. Curabitur vel vestibulum ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris hendrerit dui id augue condimentum, at interdum nisi tincidunt. Aenean fringilla sapien non mi dictum, sed auctor nisl pretium. Etiam volutpat metus libero, at tincidunt ante condimentum a. Nulla facilisi. Integer faucibus quam ut fringilla suscipit.\n\n' +
      'Cras fermentum ligula id velit suscipit, ac aliquet enim rutrum. Sed volutpat dui id nisi aliquet, at auctor elit lacinia. Suspendisse potenti. Fusce fringilla, elit ac elementum ultricies, dui felis facilisis ante, eu suscipit sem purus eget sapien. Nam ut libero eu nulla ullamcorper ullamcorper vel ut sapien. Maecenas ac vehicula neque. Fusce at urna id neque vulputate convallis. Integer ut velit dolor. Sed aliquam nunc et lorem pretium, sit amet dictum erat efficitur. Donec eu nisi sed sapien malesuada fermentum eget in orci. Integer egestas dui nec massa porttitor convallis.',
  },

  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
  {
    id: 2,
    title: 'Voorbereiding',
    date: '16/02/2025 - 19:45',
    teacher: 'Leerkracht 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  },
];

function AnnouncementsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();

  // Memoize announcements to prevent re-renders unless data changes
  const announcementsList = useMemo(() => announcementsData, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('announcements')}
        </Typography>
        {user?.teacher && (
          <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.main }}>
            {t('createNewAnnouncement')}
          </Button>
        )}
      </Box>
      {/* Scrollable box*/}
      <Box sx={{ maxHeight: 700, overflowY: 'auto' }}>
        {announcementsList.map((ann) => (
          <AnnouncementCard key={ann.id} {...ann} />
        ))}
      </Box>
    </Box>
  );
}
export default AnnouncementsPage;
