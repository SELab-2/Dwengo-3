import { Box, Button, ButtonGroup, DialogContent, DialogTitle, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useTranslation } from "react-i18next";
import { MarginSize } from "../util/size";

interface YesNoDialogProps {
    open: boolean;
    title: string;
    warning?: string;
    onClose: () => void;
    onYes: () => void;
}

function YesNoDialogProps({open, title, warning, onClose, onYes}: YesNoDialogProps) {
    const { t } = useTranslation();
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {warning && (
                    <Typography
                        color="error"
                        sx={{ mb: 2, textAlign: "center", fontWeight: 500 }}
                    >
                        {warning}
                    </Typography>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                    }}
                >
                    <ButtonGroup
                        variant="contained"
                        aria-label="yes-no button group"
                    >
                        <Button onClick={onClose} color="secondary">
                            {t('no')}
                        </Button>
                        <Button onClick={onYes} color="primary">
                            {t('yes')}
                        </Button>
                    </ButtonGroup>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default YesNoDialogProps;