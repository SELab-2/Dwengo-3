import { SelectChangeEvent, FormControl, InputLabel, Select, OutlinedInput, Box, Chip, MenuItem } from "@mui/material";
import React, { useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultipleSelectChipProps {
  label: string;
  options: string[];
  state?: [string[], React.Dispatch<React.SetStateAction<string[]>>];
};

function MultipleSelectChip({label, options, state}: MultipleSelectChipProps) {
  const [selectedOptions, setSelectedOptions] = state ?? useState<string[]>([]);
  const handleSelectChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
      const {
          target: { value },
      } = event;
      setSelectedOptions(
        typeof value === 'string' ? value.split(',') : (value),
      );
  }

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="keywords-learningPaths">{label}</InputLabel>
        <Select
            id="keywords-learningPaths"
            multiple
            value={selectedOptions}
            onChange={handleSelectChange}
            input={<OutlinedInput id="select-multiple-chip" label={label}/>}
            renderValue={(selected: string[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                    <Chip key={value} label={value} />
                ))}
                </Box>
            )}
            MenuProps={MenuProps}
        >
            {options.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
  );
}

  export default MultipleSelectChip;