import { Alert, AlertColor, Snackbar } from '@mui/material';

export default function AlertSnackBar({
  open,
  setOpen,
  message,
  severity,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
  severity: AlertColor;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
