import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

interface BasicSelectProps<T> {
  labelName: string;
  options: T[];
  required?: boolean;
  state?: [T | null, React.Dispatch<React.SetStateAction<T | null>>];
  getOptionLabel: (option: T) => string;
  getOptionKey: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
}

function BasicSelect<T>({
  labelName,
  options,
  required,
  state,
  getOptionLabel,
  getOptionKey,
  isOptionEqualToValue = (a, b) => a === b,
}: BasicSelectProps<T>) {
  const [value, setValue] = state ?? useState<T | null>(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue: T | null) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionKey={getOptionKey}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => (
        <TextField required={required} {...params} label={labelName} fullWidth margin="normal" />
      )}
    />
  );
}

export default BasicSelect;
