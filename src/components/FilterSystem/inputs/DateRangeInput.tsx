// DateRangeInput.tsx
// Renders two MUI DatePickers (From / To) for date 'between' filtering.
// Uses dayjs and the MUI LocalizationProvider with dayjs adapter.

import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface DateRangeInputProps {
  /** [fromISO, toISO] — ISO date strings or empty strings */
  value: [string, string];
  onChange: (value: [string, string]) => void;
}

export const DateRangeInput: React.FC<DateRangeInputProps> = ({ value, onChange }) => {
  const [from, to] = value ?? ['', ''];

  const fromDate: Dayjs | null = from ? dayjs(from) : null;
  const toDate: Dayjs | null   = to   ? dayjs(to)   : null;

  const handleFromChange = (newVal: Dayjs | null) => {
    onChange([newVal ? newVal.format('YYYY-MM-DD') : '', to]);
  };

  const handleToChange = (newVal: Dayjs | null) => {
    onChange([from, newVal ? newVal.format('YYYY-MM-DD') : '']);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <DatePicker
          label="From"
          value={fromDate}
          onChange={handleFromChange}
          maxDate={toDate ?? undefined}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
        />
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
        <DatePicker
          label="To"
          value={toDate}
          onChange={handleToChange}
          minDate={fromDate ?? undefined}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
        />
      </Box>
    </LocalizationProvider>
  );
};
