// MultiSelectFilterInput.tsx
// Renders a multi-select dropdown with checkboxes and chip display.
// Used for 'in' / 'notIn' operators on multiselect field types.

import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
  Chip,
  Box,
  OutlinedInput,
} from '@mui/material';
import type { SelectOption } from '../../../types/filter.types';

interface MultiSelectFilterInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuSx = {
  '& .MuiPaper-root': {
    maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
    width: 250,
  },
};

export const MultiSelectFilterInput: React.FC<MultiSelectFilterInputProps> = ({
  value,
  onChange,
  options,
}) => {
  const selected = Array.isArray(value) ? value : [];

  const handleChange = (event: { target: { value: unknown } }) => {
    const val = event.target.value;
    onChange(typeof val === 'string' ? val.split(',') : (val as string[]));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 220, maxWidth: 320 }}>
      <InputLabel>Select values</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label="Select values" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((val) => (
              <Chip
                key={val}
                label={val}
                size="small"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        )}
        sx={menuSx}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} dense>
            <Checkbox checked={selected.includes(opt.value)} size="small" />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
