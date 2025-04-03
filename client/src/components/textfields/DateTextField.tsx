import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/nl';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import { useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

function DateTextField() {
    const { t, i18n } = useTranslation();
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
            <DateTimePicker
                timezone="system"
                label={t('deadline')}
                sx={{ mt: 2, width: '100%' }}
                minDate={dayjs()}
            />
        </LocalizationProvider>
    );
}

export default DateTextField;