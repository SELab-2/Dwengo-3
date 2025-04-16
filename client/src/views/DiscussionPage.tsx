import { useParams } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CreateMessageCard } from '../components/CreateMessageCard';
import { useState } from 'react';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import MessageCard from '../components/MessageCard.tsx';

function DiscussionPage() {
  const { discussionId } = useParams();
  const { t } = useTranslation();
  const theme = useTheme();
  const [showCreateMessageCard, setShowCreateMessageCard] = useState<boolean>(false);

  const classData = {
    id: '1234',
    name: 'Klas - 6 AIT',
    teachers: ['Marnie Garcia', 'Marvin Kline'],
    notes:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
  };

  // TODO GET THE DISCUSSION DATA FROM THE API
  const DiscussionData = {
    id: 'bd7c1d74-396d-4710-97cd-e1e37950a501',
    group: {
      id: '1234group',
      progress: [1, 2, 3],
      assignmentId: '1234assignment',
      name: 'Groep 1',
    },
    members: [
      {
        id: '1234',
        surname: 'Garcia',
        name: 'Marnie',
        role: 'STUDENT',
      },
      {
        id: '12345',
        surname: 'Heeren',
        name: 'Martijn',
        role: 'TEACHER',
      },
    ],
    messages: [
      {
        id: '1234',
        content: 'Dit is een testbericht',
        sender: {
          id: '1234',
          surname: 'Garcia',
          name: 'Marnie',
          role: 'STUDENT',
        },
        discussionId: '1234',
        createdAt: new Date(),
      },
      {
        id: '1234',
        content: 'Dit is een testbericht',
        sender: {
          id: '1234',
          surname: 'Garcia',
          name: 'Marnie',
          role: 'STUDENT',
        },
        discussionId: '1234',
        createdAt: new Date(),
      },
      {
        id: '1234',
        content: 'Dit is een testbericht',
        sender: {
          id: '1234',
          surname: 'Garcia',
          name: 'Marnie',
          role: 'STUDENT',
        },
        discussionId: '1234',
        createdAt: new Date(),
      },
      {
        id: '1234',
        content:
          'Dit is een testbericht,Dit is een testbericht, Dit is een testbericht, Dit is een testbericht, Dit is een testbericht , Dit is een testbericht, Dit is een testbericht, Dit is een testbericht',
        sender: {
          id: '1234',
          surname: 'Heeren',
          name: 'Martijn',
          role: 'TEACHER',
        },
        discussionId: '1234',
        createdAt: new Date(),
      },
    ],
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData.id} className={classData.name} />

      {!showCreateMessageCard && (
        <Paper
          sx={{
            p: 2,
            maxWidth: { xs: '90%', sm: 800 }, // Responsive width
            width: '100%',
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
              gap: 1, // Adds spacing when stacked
            }}
          >
            <Typography variant="h6" gutterBottom>
              {DiscussionData.group.name}
            </Typography>

            <Button
              variant="contained"
              sx={{ backgroundColor: theme.palette.primary.main }}
              onClick={() => {
                setShowCreateMessageCard(true);
              }}
            >
              {t('createNewDiscussionMessage')}
            </Button>
          </Box>
          <Box
            sx={{
              maxHeight: { xs: 300, sm: 800 }, // Adjust height for mobile
              overflowY: 'auto',
              px: { xs: 1, sm: 2 }, // Add padding on mobile for better spacing
            }}
          >
            <Stack spacing={2}>
              {DiscussionData.messages.map((message) => (
                <MessageCard key={message.id} {...message} />
              ))}
            </Stack>
          </Box>
        </Paper>
      )}
      {showCreateMessageCard && (
        <CreateMessageCard
          disussionId={DiscussionData.id}
          hideCard={() => setShowCreateMessageCard(false)}
        />
      )}
    </Box>
  );
}

export default DiscussionPage;
