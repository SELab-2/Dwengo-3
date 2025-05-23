import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useAssignments } from '../hooks/useAssignment';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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

const DiscussionCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setError } = useError();

  // Id for the initial selected assignment when given in the URL
  const assignmentId = searchParams.get('assignmentId');

  const { classId } = useParams<{ classId: string }>();
  const { data: classData, isLoading: isLoadingClass } = useClassById(classId ?? '');

  const [message, setMessage] = useState<string>('');

  const createDiscussionMutation = useCreateDiscussion();
  const createMessageMutation = useCreateMessage();

  const { data: paginatedData, isLoading } = useAssignments({
    studentId: user?.student?.id,
    classId,
  });
  const { data: assignments } = paginatedData || { data: [], totalPages: 0 };

  // Fetch discussions for the current user to be able to filter out the assignments that are already discussed
  const { data: paginatedDiscussions } = useDiscussions({
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

  // Set the selected assignment id based on the URL parameter or the first available assignment
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignmentId ?? filteredAssignments[0]?.id ?? '',
  );

  // Create the discussion with the given input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAssignment = filteredAssignments.find(
      (a: AssignmentShort2) => a.id === selectedAssignmentId,
    );

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
                setError(error?.response?.data?.message || error?.message || t('undefinedError'));
              },
            },
          );
        },
        onError: (error: any) => {
          setError(error?.response?.data?.message || error?.message || t('undefinedError'));
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
                  {assignment.name}
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
