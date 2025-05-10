import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useAssignments, useAssignmentsOfStudent } from '../hooks/useAssignment';
import LearningPathCard from '../components/learningPathCard';
import { useNavigate } from 'react-router-dom';

// // TODO request from API
// const learningPathsData = [
//   {
//     id: 1,
//     title: 'Leerpad AI',
//     category: 'AI',
//     duration: "60'",
//     progress: 60,
//     // Deze 2 zullen niet worden meegegeven aan de client, dus zullen ook niet worden getoond
//     // in de Favorites en Continue secties
//     className: 'Klas 2',
//     dueDate: '06/03/25',
//   },
//   {
//     id: 2,
//     title: 'Leerpad Python',
//     category: 'Programmeren',
//     duration: "45'",
//     progress: 40,
//     className: 'Klas 1',
//     dueDate: '15/05/25',
//   },
// ];

// interface LearningPathItemProps {
//   title: string;
//   category: string;
//   duration: string;
//   progress: number;
//   className?: string;
//   dueDate?: string;
//   actionButtons: React.ReactNode;
//   visualizeProgress: boolean;
// }

// function LearningPathItem({
//   title,
//   category,
//   duration,
//   progress,
//   className,
//   dueDate,
//   actionButtons,
//   visualizeProgress,
// }: LearningPathItemProps) {
//   return (
//     <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
//       <Box sx={{ flex: 1 }}>
//         <Typography variant="h6">{title}</Typography>
//         <Typography variant="body2" color="textSecondary">
//           {category}
//         </Typography>
//       </Box>
//       {className && (
//         <Typography variant="body2" sx={{ color: 'blue' }}>
//           {className}
//         </Typography>
//       )}
//       {dueDate && (
//         <Typography variant="body2" sx={{ color: progress < 50 ? 'green' : 'red' }}>
//           {dueDate}
//         </Typography>
//       )}
//       {visualizeProgress && (
//         <LinearProgress
//           variant="determinate"
//           value={progress}
//           sx={{ flex: 2, height: 8, borderRadius: 5 }}
//         />
//       )}
//       <Typography variant="body2">{duration}</Typography>
//       {actionButtons}
//     </Paper>
//   );
// }

// function teacherLearningPaths(
//   learningPaths: {
//     id: number;
//     title: string;
//     category: string;
//     duration: string;
//     progress: number;
//   }[],
// ) {
//   const { t } = useTranslation();
//   return (
//     <Box sx={{ minHeight: '100vh', maxWidth: 800, mx: 'auto', mt: 4 }}>
//       {[t('myLearningPaths'), t('favorites'), t('continue')].map((section) => (
//         <Box key={section} sx={{ mt: 4 }}>
//           <Typography variant="h5" gutterBottom>
//             {section}
//           </Typography>
//           <Stack spacing={2}>
//             {learningPaths.map((path) => (
//               <LearningPathItem
//                 key={path.id}
//                 {...path}
//                 actionButtons={
//                   section === t('myLearningPaths') ? (
//                     <Button variant="contained">{t('view_edit')}</Button>
//                   ) : (
//                     <>
//                       <Button variant="contained">{t('continue')}</Button>
//                       <Button variant="outlined">{t('edit')}</Button>
//                     </>
//                   )
//                 }
//                 visualizeProgress={section !== t('myLearningPaths')}
//               />
//             ))}
//           </Stack>
//         </Box>
//       ))}
//     </Box>
//   );
// }

// function studentLearningPaths(
//   learningPaths: {
//     id: number;
//     title: string;
//     category: string;
//     duration: string;
//     progress: number;
//   }[],
// ) {
//   const { t } = useTranslation();
//   return (
//     <Box sx={{ minHeight: '100vh', maxWidth: 800, mx: 'auto', mt: 4 }}>
//       {[t('assignments'), t('favorites'), t('continue')].map((section) => (
//         <Box key={section} sx={{ mt: 4 }}>
//           <Typography variant="h5" gutterBottom>
//             {section}
//           </Typography>
//           <Stack spacing={2}>
//             {learningPaths.map((path) => (
//               <LearningPathItem
//                 key={path.id}
//                 {...path}
//                 actionButtons={<Button variant="contained">{t('continue')}</Button>}
//                 visualizeProgress={true}
//               />
//             ))}
//           </Stack>
//         </Box>
//       ))}
//     </Box>
//   );
// }

// function MyLearningPathsPage2() {
//   const { user } = useAuth();
//   // TODO api request via useEffect?
//   const [learningPaths] = useState(learningPathsData);
//   if (user?.teacher) return teacherLearningPaths(learningPaths);
//   return studentLearningPaths(learningPaths);
// }

function MyLearningPathsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const studentId = user?.student?.id;
  const teacherId = user?.teacher?.id;
  const naviate = useNavigate();

  const { data: paginatedAssignments } = useAssignments(
    undefined, // classid
    undefined, // groupid
    studentId,
    teacherId, // teacherid
  );

  // const { data : paginatedFavorites, isLoadingFavorites} = TODO ADD FAVORITES

  const assignments = paginatedAssignments?.data ?? [];
  const totalPages = paginatedAssignments?.totalPages ?? 0;

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box key={'assignments'} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('assignments')}
        </Typography>
        <Stack spacing={2}>
          {assignments.map((assignment) => (
            <LearningPathCard
              key={assignment.id}
              assignment={assignment}
              favorite={undefined}
              userId={user?.id}
              visualizeProgress={false}
              actionButtons={
                user?.student ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      /* TODO navigate to learningpath*/
                    }}
                  >
                    {t('continue')}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      /* TODO navigate to progresspage for the whole class*/
                    }}
                  >
                    {t('details')}
                  </Button>
                )
              }
            />
          ))}
        </Stack>
      </Box>
      <Box key={'favorites'} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('favorites')}
        </Typography>
        <Stack spacing={2}>
          {assignments.map((assignment) => (
            <LearningPathCard
              key={assignment.id}
              assignment={assignment}
              visualizeProgress={false}
              actionButtons={
                user?.student ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      /* TODO navigate to learningpath*/
                    }}
                  >
                    {t('continue')}
                  </Button>
                ) : (
                  <> </>
                )
              }
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default MyLearningPathsPage;
