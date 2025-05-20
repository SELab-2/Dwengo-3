import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useAssignments } from '../hooks/useAssignment';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateDiscussion,
  useDetailedDiscussionsByIds,
  useDiscussions,
} from '../hooks/useDiscussion';
import { useError } from '../hooks/useError';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { useClassById } from '../hooks/useClass';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { GroupShort } from '../util/interfaces/group.interfaces';
import { AppRoutes } from '../util/app.routes';
import { useCreateMessage } from '../hooks/useMessage';
import { fetchDiscussionById } from '../api/discussion';

const DiscussionCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const { data: classData, isLoading: isLoadingClass } = useClassById(classId ?? '');
  const [message, setMessage] = useState<string>('');
  const { setError } = useError();

  const createDiscussionMutation = useCreateDiscussion();
  const createMessageMutation = useCreateMessage();

  const { data: paginatedData, isLoading } = useAssignments({
    studentId: user?.student?.id,
    classId,
  });
  const { data: assignments, totalPages } = paginatedData || { data: [], totalPages: 0 };

  // Fetch discussions for the current user to be able to filter out the assignments that are already discussed
  const { data: paginatedDiscussions, isLoading: isLoadingDiscussions } = useDiscussions({
    userId: user?.id,
  });
  const { data: discussions } = paginatedDiscussions || { data: [] };
  const { data: detailedDiscussions } = useDetailedDiscussionsByIds(
    discussions.map((discussion) => discussion.id),
  );

  // Filter the assignments to only include those that are not already discussed
  const filteredAssignments = assignments.filter(
    (assignment: AssignmentShort2) =>
      !detailedDiscussions?.some((discussion) => discussion.group.assignmentId === assignment.id),
  );

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    filteredAssignments[0]?.id ?? '',
  );
  const selectedAssignment = filteredAssignments.find(
    (a: AssignmentShort2) => a.id === selectedAssignmentId,
  );

  // Create the discussion with the given input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const groupId =
      selectedAssignment?.groups.filter((group: GroupShort) =>
        group.students.some((student) => student.id === user?.student?.id),
      )[0].id ?? '';

    createDiscussionMutation.mutate(
      { groupId },
      {
        onSuccess: (response) => {
          createMessageMutation.mutate(
            {
              discussionId: response.id,
              content: message,
            },
            {
              onSuccess: () => {
                navigate(AppRoutes.classDiscussions(classId!));
              },
              onError: (error: any) => {
                setError(
                  error?.response?.data?.message || error?.message || t('errorSendingErrorMessage'),
                );
              },
            },
          );
        },
        onError: (error: any) => {
          setError(
            error?.response?.data?.message || error?.message || t('errorSendingErrorMessage'),
          );
        },
      },
    );
  };

  return !isLoadingClass && !isLoading ? (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classId!} className={classData!.name} />
      <Paper sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('createADiscussion')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="assignment-label">{t('assignment')}</InputLabel>
            <Select
              labelId="assignment-label"
              value={selectedAssignmentId}
              label={t('assignment')}
              onChange={(e) => setSelectedAssignmentId(e.target.value as string)}
              required
              disabled={isLoading}
            >
              {filteredAssignments?.map((assignment: AssignmentShort2) => (
                <MenuItem key={assignment.id} value={assignment.id}>
                  {assignment.learningPath.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('firstMessage')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            minRows={6}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            helperText={`${message.length}/500`}
            required
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none' }}>
              {t('startDiscussion')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  ) : null;
};

export default DiscussionCreatePage;
