// SelectFilterInput.tsx
// Renders a single-select MUI Select dropdown for 'is' / 'isNot' operators.

import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import type { SelectOption } from '../../../types/filter.types';

interface SelectFilterInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export const SelectFilterInput: React.FC<SelectFilterInputProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel>Select value</InputLabel>
      <Select
        value={value ?? ''}
        label="Select value"
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
