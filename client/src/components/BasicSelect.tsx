import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

interface BasicSelectProps {
    labelName: string;
    options: string[];
    required?: boolean;
    state?: [string, React.Dispatch<React.SetStateAction<string>>];
};

function BasicSelect({labelName, options, required, state}: BasicSelectProps) {
    const [option, setOption] = state ?? useState<string>('');
    const handleChange = (event: SelectChangeEvent) => {
        setOption(event.target.value);
    };

    return (
        <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel required={required} id="demo-simple-select-label">{labelName}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={option}
                label={labelName}
                onChange={handleChange}
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

export default BasicSelect;