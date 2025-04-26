import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import MessageCard from '../components/MessageCard.tsx';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { CreateMessageCard } from '../components/CreateMessageCard.tsx';
import { useParams } from 'react-router-dom';

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
  teachers: ['Marnie Garcia', 'Marvin Kline'],
  notes:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
};

// TODO GET THE DISCUSSION DATA FROM THE API
const discussionsArray = [
  {
    id: '1',
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
  },
  {
    id: '2',
    group: {
      id: '1234group',
      progress: [1, 2, 3],
      assignmentId: '1234assignment',
      name: 'Groep 2',
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
  },
];

function ClassDiscussionsPage() {
  const { classId } = useParams<{ classId: string }>(); // Get the announcement ID from the URL
  const { t } = useTranslation();
  const theme = useTheme();
  const [showCreateMessageCard, setShowCreateMessageCard] = useState<boolean>(false);
  const [creatingMessageDiscussionId, setCreatingMessageDiscussionId] = useState<string | null>(
    null,
  );

  // TODO
  const [collapsedDiscussions, setCollapsedDiscussions] = useState<{ [key: string]: boolean }>({
    '1': true,
    '2': true,
  });

  const toggleCollapse = (id: string) => {
    setCollapsedDiscussions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classId!} className={classData.name} />

      {!showCreateMessageCard &&
        discussionsArray.map((discussion) => {
          const isCollapsed = collapsedDiscussions[discussion.id] ?? true;

          return (
            <Paper
              key={discussion.id}
              sx={{
                p: 2,
                maxWidth: { xs: '90%', sm: 800 },
                width: '100%',
                mx: 'auto',
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1,
                  margin: 'auto',
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {discussion.group.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: theme.palette.primary.main }}
                    onClick={() => {
                      setShowCreateMessageCard(true);
                      setCreatingMessageDiscussionId(discussion.id);
                    }}
                  >
                    {t('createNewDiscussionMessage')}
                  </Button>

                  <IconButton onClick={() => toggleCollapse(discussion.id)}>
                    {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={!isCollapsed}>
                <Box
                  sx={{
                    maxHeight: { xs: 300, sm: 800 },
                    overflowY: 'auto',
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  <Stack spacing={2} mb={1} mt={2}>
                    {discussion.messages.map((message, i) => (
                      <MessageCard key={`${message.id}-${i}`} {...message} />
                    ))}
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          );
        })}

      {showCreateMessageCard && (
        <CreateMessageCard
          disussionId={creatingMessageDiscussionId!}
          hideCard={() => setShowCreateMessageCard(false)}
        />
      )}
    </Box>
  );
}

export default ClassDiscussionsPage;
