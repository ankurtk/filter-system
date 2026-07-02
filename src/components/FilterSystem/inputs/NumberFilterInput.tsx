// NumberFilterInput.tsx
// Renders a number input for numeric filter conditions.
// Validates that the entered value is a finite number.

import React, { useState, useEffect } from 'react';
import { TextField, Typography } from '@mui/material';
import { useDebounce } from '../../../hooks/useDebounce';

interface NumberFilterInputProps {
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
}

export const NumberFilterInput: React.FC<NumberFilterInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter number...',
}) => {
  const [localValue, setLocalValue] = useState(String(value ?? ''));
  const [error, setError] = useState('');
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    if (debouncedValue === '') {
      onChange('');
      setError('');
      return;
    }
    const num = Number(debouncedValue);
    if (isNaN(num)) {
      setError('Must be a valid number');
    } else {
      setError('');
      onChange(num);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    setLocalValue(String(value ?? ''));
  }, [value]);

  return (
    <>
      <TextField
        size="small"
        fullWidth
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        error={Boolean(error)}
        sx={{ minWidth: 160 }}
        slotProps={{ htmlInput: { step: 'any' } }}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </>
  );
};
