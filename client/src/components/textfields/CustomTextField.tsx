import { TextField } from '@mui/material';

function CustomTextField({
  value,
  setValue,
  translation,
  required = true,
  autoFocus = false,
}: {
  value: string;
  setValue: (value: string) => void;
  translation: string;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <TextField
      margin="normal"
      required={required}
      fullWidth
      label={translation}
      name={translation}
      type="text"
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default CustomTextField;
