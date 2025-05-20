import { TextField, useMediaQuery } from '@mui/material';
import { HTMLInputTypeAttribute } from 'react';
import { MarginSize } from '../../util/size';

function CustomTextField({
  value,
  setValue,
  translation,
  required = true,
  autoFocus = false,
  type = 'text',
}: {
  value: string;
  setValue: (value: string) => void;
  translation: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: HTMLInputTypeAttribute;
}) {
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <TextField
      required={required}
      fullWidth
      label={translation}
      name={translation}
      type={type}
      autoFocus={autoFocus}
      value={value}
      sx={{
        mt: isMobile ? MarginSize.tiny : MarginSize.xsmall,
      }}
      size={isMobile ? 'small' : 'medium'}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default CustomTextField;
