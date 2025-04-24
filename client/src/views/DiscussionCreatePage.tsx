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
import { useParams } from 'react-router-dom';
import { useCreateDiscussion } from '../hooks/useDiscussion';
import { useError } from '../hooks/useError';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { useClassById } from '../hooks/useClass';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { GroupShort } from '../util/interfaces/group.interfaces';

const DiscussionCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { classId } = useParams<{ classId: string }>();

  const { data: classData, isLoading: isLoadingClass } = useClassById(classId ?? '');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentShort2>();
  const [message, setMessage] = useState<string>('');
  const { setError } = useError();

  const createDiscussionMutation = useCreateDiscussion();
  const { data: paginatedData, isLoading } = useAssignments({
    studentId: user?.student?.id,
    classId,
  });
  const { data: assignments, totalPages } = paginatedData || { data: [], totalPages: 0 };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const groupId =
      selectedAssignment?.groups.filter((group: GroupShort) =>
        group.students.some((student) => student.id === user?.student?.id),
      )[0].id ?? '';

    createDiscussionMutation.mutate(
      { groupId, message },
      {
        onSuccess: () => {},
        onError: (error: any) => {
          setError(error.message);
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
              value={selectedAssignment}
              label={t('assignment')}
              onChange={(e) => setSelectedAssignment(e.target.value as AssignmentShort2)}
              required
              disabled={isLoading}
            >
              {assignments?.map((assignment: any) => (
                <MenuItem key={assignment.id} value={assignment}>
                  {assignment.title}
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
