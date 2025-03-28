import { Alert, Snackbar } from '@mui/material';

export default function ErrorSnackBar({
  open,
  setOpen,
  error,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  error: string;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
}
