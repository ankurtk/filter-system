// AmountRangeInput.tsx
// Renders two number fields (Min / Max) for amount/currency range filtering.
// Displays values with a dollar-sign prefix hint.

import React from 'react';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';

interface AmountRangeInputProps {
  /** [minStr, maxStr] — numeric strings or empty strings */
  value: [string, string];
  onChange: (value: [string, string]) => void;
}

export const AmountRangeInput: React.FC<AmountRangeInputProps> = ({ value, onChange }) => {
  const [min, max] = value ?? ['', ''];

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange([e.target.value, max]);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange([min, e.target.value]);
  };

  const minError = min !== '' && max !== '' && Number(min) > Number(max);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <TextField
        size="small"
        label="Min"
        type="number"
        value={min}
        onChange={handleMin}
        error={minError}
        sx={{ minWidth: 130 }}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          htmlInput: { min: 0, step: 1000 },
        }}
      />
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
      <TextField
        size="small"
        label="Max"
        type="number"
        value={max}
        onChange={handleMax}
        error={minError}
        sx={{ minWidth: 130 }}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          htmlInput: { min: 0, step: 1000 },
        }}
      />
      {minError && (
        <Typography variant="caption" color="error" sx={{ width: '100%' }}>
          Min must not exceed Max
        </Typography>
      )}
    </Box>
  );
};
