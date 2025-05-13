import {
  Box,
  Button,
  Collapse,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAssignmentById } from '../hooks/useAssignment';
import { useClassById } from '../hooks/useClass';
import { MarginSize } from '../util/size';
import AssignmentInfoCard from '../components/AssignmentInfoCard';
import BackButton from '../components/BackButton';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { AppRoutes } from '../util/app.routes';
import { GroupShort } from '../util/interfaces/group.interfaces';
import GroupListDialog from '../components/GroupListDialog';
import { useState } from 'react';
import { useLearningObjects } from '../hooks/useLearningObject';
import {
  AssignmentSubmissionDetail,
  FileSubmission,
  MultipleChoice,
  SubmissionType,
} from '../util/interfaces/assignmentSubmission.interfaces';
import DoneIcon from '@mui/icons-material/Done';
import { ExpandLess, ExpandMore, FileDownload, QuestionMark } from '@mui/icons-material';
import { LearningObjectDetail } from '../util/interfaces/learningObject.interfaces';
import { LearningPathShort } from '../util/interfaces/learningPath.interfaces';
import { useAssignmentSubmissions } from '../hooks/useAssignmentSubmission';
import { downloadFileSubmission } from '../api/assignmentSubmission';

const calculateProgress = (progress: number[], learningPath: LearningPathShort) => {
  const total_nodes = learningPath.learningPathNodes.length;
  // + 1 is added because of zero indexing
  return progress.length > 0 ? ((Math.max(...progress) + 1) / total_nodes) * 100 : 0;
};

function SubmissionPage() {
  const { classId, assignmentId, groupId } = useParams<{
    classId: string;
    assignmentId: string;
    groupId: string;
  }>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const { data: classData, isLoading: isLoadingClass } = useClassById(classId!);
  const { data: assignment, isLoading: isLoadingAssignment } = useAssignmentById(assignmentId!);
  const { data: learningObjects, isLoading: isLoadingObjects } = useLearningObjects(
    assignment?.learningPath.id!,
  );
  const { data: submissions, isLoading: isLoadingSubmissions } = useAssignmentSubmissions(groupId);

  if (isLoadingAssignment || isLoadingObjects || isLoadingClass || isLoadingSubmissions) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
        {t('loading')}
      </Typography>
    );
  }

  const group: GroupShort = assignment!.groups.find((g) => g.id === groupId)!;
  const progress: number = calculateProgress(group.progress, assignment!.learningPath);
  const maxProgress = Math.max(...group.progress);

  const handleClick = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const multipleChoice = (object: LearningObjectDetail) => {
    return object.multipleChoice as unknown as MultipleChoice;
  };

  const fileSubmission = (submission: AssignmentSubmissionDetail) => {
    return submission.submission as unknown as FileSubmission;
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData!.id} className={classData!.name} />

      <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%', sm: 1000 }, p: 2 }}>
        <BackButton link={AppRoutes.classAssignment(classId!, assignmentId!)} />

        <AssignmentInfoCard
          name={assignment!.name}
          description={assignment!.description}
          teacher={assignment!.teacher}
          deadline={assignment!.deadline}
        />

        <GroupListDialog students={group.students} open={open} onClose={() => setOpen(false)} />

        <Box display="flex" justifyContent="center">
          <Stack>
            <Typography variant="h6" display="inline">
              {`${t('group')}: `}
              <Typography
                component="span"
                onClick={() => setOpen(true)}
                color="primary"
                sx={{ cursor: 'pointer' }}
                display="inline"
                variant="h6"
              >
                {group.name}
              </Typography>
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 5,
                minWidth: { xs: '80px', sm: '150px', md: '200px' },
                marginBottom: MarginSize.tiny,
                marginTop: MarginSize.tiny,
              }}
            />

            <Typography>{`${progress}% ${t('completed')}`}</Typography>

            <List
              sx={{ width: '100%', minWidth: { xs: '90%', sm: 600 }, bgcolor: 'background.paper' }}
              component="nav"
            >
              {learningObjects!.map((object, index) => {
                const submission = submissions!.find(
                  (sub) => sub.node.learningObject.id === object.id,
                );
                const made =
                  index <= maxProgress &&
                  (object.submissionType === SubmissionType.READ || submission !== undefined);
                return object.submissionType === SubmissionType.READ ? (
                  <ListItem
                    sx={{
                      backgroundColor: made ? theme.palette.primary.main : 'gray',
                      color: 'white',
                    }}
                    key={object.id}
                  >
                    <ListItemText primary={object.hruid} />
                    {made && (
                      <ListItemIcon>
                        <DoneIcon />
                      </ListItemIcon>
                    )}
                  </ListItem>
                ) : object.submissionType === SubmissionType.MULTIPLE_CHOICE ? (
                  <Box>
                    <ListItemButton
                      onClick={() => handleClick(object.id)}
                      sx={{
                        backgroundColor: made ? theme.palette.primary.main : 'gray',
                        color: 'white',
                      }}
                      key={object.id}
                    >
                      <ListItemIcon>
                        <QuestionMark color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary={object.hruid} />
                      {openItems[object.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openItems[object.id]} timeout="auto" unmountOnExit>
                      {
                        <Box>
                          <Typography>
                            {`${t('question')}: ${multipleChoice(object).question}?`}
                          </Typography>
                          {multipleChoice(object).options.map((option, index) => (
                            <Typography marginLeft={MarginSize.small}>
                              {`${index + 1}: ${option}`}
                            </Typography>
                          ))}
                        </Box>
                      }
                    </Collapse>
                  </Box>
                ) : (
                  <ListItemButton
                    sx={{
                      backgroundColor: made ? theme.palette.primary.main : 'gray',
                      color: 'white',
                    }}
                    key={object.id}
                    onClick={() =>
                      downloadFileSubmission(submission!.id, fileSubmission(submission!).fileName)
                    }
                  >
                    <ListItemIcon>
                      <FileDownload color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={object.hruid}
                      secondary={made ? fileSubmission(submission!).fileName : ''}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default SubmissionPage;
