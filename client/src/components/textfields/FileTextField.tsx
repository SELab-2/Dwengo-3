import { TextField } from "@mui/material";

function FileTextField({setFile}: {setFile: (file: File | null) => void}) {
    return (
        <TextField
            type="file"
            variant="outlined"
            onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const selectedFile = input.files?.[0] || null;
                setFile(selectedFile);
              }}
            fullWidth
            slotProps={{
                htmlInput: {
                    accept: "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain image/*",
                    multiple: false,
                }
            }}
            margin="normal"
        />
    );
}

export default FileTextField;