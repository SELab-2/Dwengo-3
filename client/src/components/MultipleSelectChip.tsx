import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

interface MultipleSelectChipProps {
  label: string;
  options: string[];
  state?: [string[], React.Dispatch<React.SetStateAction<string[]>>];
};

function MultipleSelectChip({label, options, state}: MultipleSelectChipProps) {
  const [selectedOptions, setSelectedOptions] = state ?? useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedOptions}
      onChange={(_, newValue) => {
        setSelectedOptions(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={label} fullWidth margin="normal" />
      )}
      />
  );
}

  export default MultipleSelectChip;