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

const learningPaths = [
  {
    id: '1',
    title: 'Learning Path 1',
    description: 'Description of Learning Path 1',
    image: 'https://via.placeholder.com/150',
    keywords: ['AI', 'Machine Learning'],
  },
  {
    id: '2',
    title: 'Learning Path 2',
    description: 'Description of Learning Path 2',
    image: 'https://via.placeholder.com/150',
    keywords: ['Data Science', 'Statistics'],
  },
  {
    id: '3',
    title: 'Learning Path 3',
    description: 'Description of Learning Path 3',
    image: 'https://via.placeholder.com/150',
    keywords: ['Web Development', 'JavaScript'],
  },
  {
    id: '4',
    title: 'Learning Path 4',
    description: 'Description of Learning Path 4',
    image: 'https://via.placeholder.com/150',
    keywords: ['Mobile Development', 'React Native'],
  },
  {
    id: '5',
    title: 'Learning Path 5',
    description: 'Description of Learning Path 5',
    image: 'https://via.placeholder.com/150',
    keywords: ['Cloud Computing', 'AWS'],
  },
  {
    id: '6',
    title: 'Learning Path 6',
    description: 'Description of Learning Path 6',
    image: 'https://via.placeholder.com/150',
    keywords: ['Cybersecurity', 'Network Security'],
  },
];

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
  teachers: ['Marnie Garcia', 'Marvin Kline'],
  notes:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
};

const keywords = learningPaths.map((path) => path.keywords).flat();

const studentsData: StudentShort[] = [
  { id: '1', user: { name: 'Roshnie', surname: 'Soetens' } },
  { id: '2', user: { name: 'Charmayne', surname: 'Breijer' } },
  { id: '3', user: { name: 'Soulaiman', surname: 'Bosland' } },
  { id: '4', user: { name: 'Ouassima', surname: 'Wiltink' } },
  { id: '5', user: { name: 'Davey', surname: 'Kraft' } },
  { id: '6', user: { name: 'Franciscus', surname: 'de Bruin' } },
  { id: '7', user: { name: 'Florence', surname: 'Rijsbergen' } },
  { id: '8', user: { name: 'Seher', surname: 'van den Doel' } },
];

function makeRandomGroups(groupSize: number): StudentShort[][] {
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
}

function AssignmentCreatePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState(1);
  const [filteredLearningPaths, setFilteredLearningPaths] = useState<string[]>(
    learningPaths.map((path) => path.title),
  );
  const [selectedLearningPath, setSelectedLearningPath] = useState<string | null>('');

  useEffect(() => {
    const updatedPaths = learningPaths
      .filter(
        (path) =>
          // if no keywords are selected, all learningpaths are shown
          selectedKeywords.length === 0 ||
          path.keywords.some((keyword) => selectedKeywords.includes(keyword)),
      )
      .map((path) => path.title);

    setFilteredLearningPaths(updatedPaths);
    if (selectedLearningPath && !updatedPaths.includes(selectedLearningPath)) {
      setSelectedLearningPath('');
    }
  }, [selectedKeywords]);

  const handleGroupSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(event.target.value);
    // Ensure value is at least 1 and smaller than students.length
    value = Math.min(Math.max(1, value), studentsData.length);
    setGroupSize(value);
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData.id} className={classData.name} />
      <Box sx={{ width: '100%', maxWidth: { xs: '95%', sm: '90%' }, mx: 'auto', mt: 4, p: 2 }}>
        <BackButton link={`/class/${classData.id}/assignments`} />

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
            />
            <TextField
              id="description-assignment"
              label={t('description')}
              variant="outlined"
              multiline
              margin="dense"
              rows={5}
              fullWidth
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
            <BasicSelect
              required
              labelName={t('learningPath')}
              options={filteredLearningPaths}
              state={[selectedLearningPath, setSelectedLearningPath]}
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
              {makeRandomGroups(groupSize).map((group, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${t('group')} ${index + 1}`}
                      secondary={group.map((student) => (
                        <Typography key={student.id} variant="body2">
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
            onClick={() => alert('TODO: Save assignment')}
          >
            {t('save')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AssignmentCreatePage;
