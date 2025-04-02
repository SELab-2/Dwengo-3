import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

interface BasicSelectProps {
    labelName: string;
    options: string[];
    required?: boolean;
    state?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
};

function BasicSelect({labelName, options, required, state}: BasicSelectProps) {
    const [value, setValue] = state ?? useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');

    return (
        <Autocomplete
            value={value}
            onChange={(_, newValue: string | null) => {
            setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
            }}
            options={options}
            renderInput={(params) => (
                <TextField
                    required={required}
                    {...params}
                    label={labelName}
                    fullWidth
                    margin="normal"
                />
            )}
        />
    );
}

export default BasicSelect;