import { Button, Typography, Box, Stack } from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MarginSize } from "../../util/size";

function FileTextField({ setFile }: { setFile: (file: File | null) => void }) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile?.name || "");
  };

  return (
      <Stack
        direction="row"
        sx={{
            marginBottom: MarginSize.xsmall,
        }}
        borderColor={"black"}
        border={1}
      >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, image/*"
      />
      <Button variant="contained" onClick={() => inputRef.current?.click()}>
        {t("chooseFile")}
      </Button>
      <Typography variant="h6" mt={2} marginLeft={2}>
        {fileName || t("noFileSelected")}
      </Typography>
    </Stack>
  );
}

export default FileTextField;
