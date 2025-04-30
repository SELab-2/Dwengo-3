import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import BasicSelect from '../components/BasicSelect';
import MultipleSelectChip from '../components/MultipleSelectChip';
import { useEffect, useState } from 'react';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { useNavigate, useParams } from 'react-router-dom';
import DateTextField from '../components/textfields/DateTextField';
import { StudentShort } from '../util/interfaces/student.interfaces';
import BackButton from '../components/BackButton.tsx';
import { useClassById } from '../hooks/useClass.ts';
import { MarginSize } from '../util/size.ts';
import { useLearningObjectById } from '../hooks/useLearningObject.ts';
import { useLearningPath } from '../hooks/useLearningPath.ts';
import { useCreateAssignment } from '../hooks/useAssignment.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { AssignmentCreate, AssignmentDetail } from '../util/interfaces/assignment.interfaces.ts';
import { AppRoutes } from '../util/app.routes.ts';
import { useError } from '../hooks/useError.ts';
import { LearningPathShort } from '../util/interfaces/learningPath.interfaces.ts';

function AssignmentCreatePage() {
  const { user } = useAuth();
  const { classId } = useParams<{ classId: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const assignmentMutation = useCreateAssignment();
  const navigate = useNavigate();
  const { setError } = useError();

  const teacherId = user?.teacher?.id;
  const { data: paginatedData, isLoading: isLoadingLearningPaths } = useLearningPath();
  const learningPaths = paginatedData?.data ?? [];

  const keywords = Array.from(
    new Set(
      learningPaths.flatMap((path) =>
        path.learningPathNodes.flatMap((node) =>
          node.learningObject.keywords.map((keyword) => keyword.keyword),
        ),
      ),
    ),
  );

  const { data: classData, isLoading: isLoadingClass } = useClassById(classId!);
  const studentsData = classData?.students ?? [];

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState(1);
  const [filteredLearningPaths, setFilteredLearningPaths] =
    useState<LearningPathShort[]>(learningPaths);
  const [selectedLearningPath, setSelectedLearningPath] = useState<LearningPathShort | null>(null);
  const [groups, setGroups] = useState<StudentShort[][]>(studentsData.map((student) => [student]));
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const updatedPaths = learningPaths.filter(
      (path) =>
        // if no keywords are selected, all learningpaths are shown
        selectedKeywords.length === 0 ||
        path.learningPathNodes.some((node) =>
          node.learningObject.keywords.some((keyword) =>
            selectedKeywords.includes(keyword.keyword),
          ),
        ),
    );

    setFilteredLearningPaths(updatedPaths);
    if (
      selectedLearningPath &&
      !updatedPaths.find((path) => path.title === selectedLearningPath.title)
    ) {
      setSelectedLearningPath(null);
    }
  }, [selectedKeywords, learningPaths]);

  const handleGroupSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(event.target.value);
    // Ensure value is at least 1 and smaller than students.length
    value = Math.min(Math.max(1, value), studentsData.length);
    setGroupSize(value);
    setGroups(makeRandomGroups(value));
  };

  const handleSubmit = () => {
    //TODO: add (name, description) and deadline
    const data: AssignmentCreate = {
      name: name,
      description: description,
      classId: classId!,
      teacherId: teacherId!,
      groups: groups.map((group) => group.map((student) => student.id)),
      learningPathId: selectedLearningPath!.id,
    };
    assignmentMutation.mutate(data, {
      onSuccess: (response: AssignmentDetail) => {
        navigate(AppRoutes.classAssignment(classId!, response.id));
      },
      onError: (error: Error) => {
        setError(error.message);
      },
    });
  };

  const makeRandomGroups = (groupSize: number): StudentShort[][] => {
    // work with copy of the array as to not change the original student list
    const copied_students = studentsData.map((student) => ({ ...student }));
    const shuffled = copied_students.sort(() => Math.random() - 0.5); // shuffle the students array randomly

    // initialize empty array for each group
    const groups: StudentShort[][] = Array.from(
      {
        length: Math.ceil(copied_students.length / groupSize),
      },
      () => [],
    );

    shuffled.forEach((student, index) => {
      groups[index % groups.length].push(student); // Round-robin
    });

    return groups;
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {isLoadingClass ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
          {t('loading')}
        </Typography>
      ) : (
        <ClassNavigationBar id={classData!.id} className={classData!.name} />
      )}
      <Box sx={{ width: '100%', maxWidth: { xs: '95%', sm: '90%' }, mx: 'auto', mt: 4, p: 2 }}>
        <BackButton link={`/class/${classData?.id}/assignments`} />

        <Typography variant="h4" gutterBottom>
          {t('createAssignment')}
        </Typography>
        <Grid container spacing={2}>
          {/* Assignment Name & Description */}
          <Grid size={{ xs: 12, md: 4, sm: 6 }}>
            <TextField
              required
              id="name-assignment"
              label={t('name')}
              variant="outlined"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText={`${name.length}/255`}
            />
            <TextField
              id="description-assignment"
              label={t('description')}
              variant="outlined"
              multiline
              margin="dense"
              rows={5}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 500 } }}
              helperText={`${description.length}/500`}
            />
            <DateTextField />
          </Grid>

          {/* Keywords & Learning Paths */}
          <Grid size={{ xs: 12, md: 4, sm: 6 }}>
            <MultipleSelectChip
              label={t('keywords')}
              options={keywords}
              state={[selectedKeywords, setSelectedKeywords]}
            />
            <BasicSelect<LearningPathShort>
              required
              labelName={t('learningPath')}
              options={filteredLearningPaths}
              state={[selectedLearningPath, setSelectedLearningPath]}
              getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* Group Size & Generated Groups */}
          <Grid size={{ xs: 12, md: 4, sm: 6 }}>
            <TextField
              id="group-size"
              label={t('groupSize')}
              variant="outlined"
              margin="normal"
              fullWidth
              type="number"
              value={groupSize}
              onChange={handleGroupSizeChange}
            />

            {/* Scrollable Group List */}
            <List
              sx={{
                width: '100%',
                mt: 1,
                maxHeight: 300,
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '8px',
                p: 1,
                bgcolor: 'background.paper',
              }}
            >
              {groups.map((group, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${t('group')} ${index + 1}`}
                      secondary={group.map((student) => (
                        <Typography
                          key={student.id}
                          variant="body2"
                          component="span"
                          display="block"
                        >
                          {student.user.name} {student.user.surname}
                        </Typography>
                      ))}
                    />
                  </ListItem>
                  <Divider /> {/* Add divider between groups */}
                </div>
              ))}
            </List>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              width: { xs: '100%', sm: '40%' }, // Full width on mobile, auto on larger screens
            }}
            onClick={handleSubmit}
          >
            {t('save')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AssignmentCreatePage;
