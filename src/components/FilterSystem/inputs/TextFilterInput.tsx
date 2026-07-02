// TextFilterInput.tsx
// Renders a debounced text field for text-type filter conditions.

import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useDebounce } from '../../../hooks/useDebounce';

interface TextFilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextFilterInput: React.FC<TextFilterInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter value...',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  // Sync debounced value up to parent
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // Sync external resets (e.g. clear all) back to local
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <TextField
      size="small"
      fullWidth
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      sx={{ minWidth: 180 }}
    />
  );
};
