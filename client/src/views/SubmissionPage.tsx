import { Box, Button, Typography } from '@mui/material';
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
import {
  LearningPathNodeDetail,
  LearningPathNodeShort,
} from '../util/interfaces/learningPathNode.interfaces';
import { LearningObjectDetail } from '../util/interfaces/learningObject.interfaces';
import { useLearningObjectById, useLearningObjects } from '../hooks/useLearningObject';
import { useLearningPathById } from '../hooks/useLearningPath';

function SubmissionPage() {
  const { classId, assignmentId, groupId } = useParams<{
    classId: string;
    assignmentId: string;
    groupId: string;
  }>();
  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);

  const { data: classData, isLoading: isLoadingClass } = useClassById(classId!);
  const { data: assignment, isLoading: isLoadingAssignment } = useAssignmentById(assignmentId!);
  const { data: learningObjects, isLoading: isLoadingObjects } = useLearningObjects(
    assignment?.learningPath.id!,
  );

  if (isLoadingAssignment || isLoadingObjects || isLoadingClass) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
        {t('loading')}
      </Typography>
    );
  }

  const group: GroupShort = assignment!.groups.find((g) => g.id === groupId)!;

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
      </Box>
    </Box>
  );
}

export default SubmissionPage;
