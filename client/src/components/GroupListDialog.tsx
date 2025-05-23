import { Dialog, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StudentShort } from '../util/interfaces/student.interfaces';

interface GroupListDialogProps {
  students: StudentShort[];
  open: boolean;
  onClose: () => void;
}

function GroupListDialog({ students, open, onClose }: GroupListDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t('students')}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {students.map((student) => (
          <ListItem key={student.user.name}>
            <ListItemText primary={`${student.user.name} ${student.user.surname}`} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default GroupListDialog;
