// BooleanFilterInput.tsx
// Renders a toggle group (Active / Inactive) for boolean filter conditions.

import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';

interface BooleanFilterInputProps {
  /** "true" | "false" | "" */
  value: string;
  onChange: (value: string) => void;
}

export const BooleanFilterInput: React.FC<BooleanFilterInputProps> = ({ value, onChange }) => {
  return (
    <Box>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newVal) => {
          if (newVal !== null) onChange(newVal);
        }}
        size="small"
        aria-label="boolean filter"
      >
        <ToggleButton
          value="true"
          aria-label="active"
          sx={{
            px: 2,
            gap: 0.5,
            fontSize: '0.82rem',
            fontWeight: 500,
            '&.Mui-selected': {
              bgcolor: 'success.main',
              color: 'white',
              '&:hover': { bgcolor: 'success.dark' },
            },
          }}
        >
          <CheckCircle size={14} />
          Active
        </ToggleButton>
        <ToggleButton
          value="false"
          aria-label="inactive"
          sx={{
            px: 2,
            gap: 0.5,
            fontSize: '0.82rem',
            fontWeight: 500,
            '&.Mui-selected': {
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' },
            },
          }}
        >
          <XCircle size={14} />
          Inactive
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
