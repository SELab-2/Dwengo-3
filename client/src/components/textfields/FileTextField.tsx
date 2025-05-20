import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MarginSize } from '../../util/size';
import { AxiosProgressEvent } from 'axios';

function FileTextField({
  setFile,
  progressEvent,
}: {
  setFile: (file: File | null) => void;
  progressEvent?: AxiosProgressEvent;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile?.name || '');
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          marginBottom: MarginSize.xsmall,
          marginTop: MarginSize.xsmall,
        }}
        borderColor={'black'}
        border={1}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, image/*"
        />
        <Button variant="contained" onClick={() => inputRef.current?.click()}>
          {t('chooseFile')}
        </Button>
        <Typography variant="h6" mt={2} marginLeft={2}>
          {fileName || t('noFileSelected')}
        </Typography>
      </Stack>
      {progressEvent && (
        <LinearProgress
          variant="determinate"
          value={Math.round((progressEvent.loaded * 100) / progressEvent.total!)}
          sx={{
            height: 8,
            borderRadius: 5,
            minWidth: { xs: '80px', sm: '150px', md: '200px' },
            marginBottom: MarginSize.xsmall,
          }}
        />
      )}
    </Box>
  );
}

export default FileTextField;
