import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Collapse,
  Chip,
  Button,
  Paper,
  TextField,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { DiscussionShort } from '../util/interfaces/discussion.interfaces';
import { useDiscussionById } from '../hooks/useDiscussion';
import MessageCard from './MessageCard';
import { useState } from 'react';
import { useCreateMessage } from '../hooks/useMessage';
import { useError } from '../hooks/useError';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

function DiscussionCard({ discussion }: { discussion: DiscussionShort }) {
  const { data: discussionDetails } = useDiscussionById(discussion.id);
  const [expanded, setExpanded] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { setError } = useError();
  const createMessageMutation = useCreateMessage();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { t } = useTranslation();

  if (!discussionDetails) {
    return null;
  }

  const handleSendMessage = () => {
    createMessageMutation.mutate(
      {
        content: newMessage,
        discussionId: discussionDetails.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['discussion', discussion.id] });
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );

    setShowNewMessage(false);
    setNewMessage('');
  };

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      {/* Clickable Top Bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          cursor: 'pointer',
          px: 2,
          py: 1,
          borderRadius: 1,
          transition: 'background 0.2s',
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {/* Members */}
        <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
          {discussionDetails.members
            .filter((member: any) => member.role !== 'TEACHER')
            .map((member: any) => (
              <Chip
                key={member.id}
                label={`${member.name} ${member.surname}`}
                size="small"
                variant="outlined"
                sx={{ background: theme.palette.primary.main }}
              />
            ))}
        </Box>
        {/* Message count, and fold icon */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">{discussionDetails.messages?.length ?? 0}</Typography>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Box>

      {/* Foldable content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Send new message button */}
          <Box display="flex" alignItems="center" mb={2}>
            <Button
              size="small"
              color="primary"
              startIcon={<AddCommentIcon />}
              onClick={() => setShowNewMessage(true)}
              sx={{ mr: 1, textTransform: 'none' }}
            >
              {t('sendNewMessage')}
            </Button>
          </Box>

          {/* New Message Popup */}
          {showNewMessage && (
            <Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label={t('newMessage')}
                value={newMessage}
                slotProps={{ htmlInput: { maxLength: 500 } }}
                helperText={`${newMessage.length}/500`}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" onClick={() => setShowNewMessage(false)}>
                  {t('cancel')}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  {t('send')}
                </Button>
              </Box>
            </Paper>
          )}

          {/* Messages */}
          <Box mt={2}>
            {discussionDetails.messages && discussionDetails.messages.length > 0 ? (
              discussionDetails.messages.map((msg: any) => (
                <MessageCard
                  key={msg.id}
                  id={msg.id}
                  content={msg.content}
                  sender={msg.sender}
                  discussionId={discussionDetails.id}
                  createdAt={new Date(msg.createdAt)}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('noMessegesYet')}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default DiscussionCard;
