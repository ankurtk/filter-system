// ActiveFilterChips.tsx
// Displays a summary of currently applied filter conditions as dismissible chips.
// Each chip shows: "Field Operator Value" and clicking X removes that filter.

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import type { FilterCondition, FilterFieldDefinition } from '../../types/filter.types';
import { OPERATOR_LABELS } from '../../utils/operators';

interface ActiveFilterChipsProps {
  appliedConditions: FilterCondition[];
  fieldDefinitions: FilterFieldDefinition[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

function formatValue(condition: FilterCondition, fieldDef?: FilterFieldDefinition): string {
  const { value } = condition;
  if (value === null || value === undefined) return '';

  if (fieldDef?.type === 'boolean') {
    return value === 'true' ? 'Active' : 'Inactive';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    if (value.length === 2 && (fieldDef?.type === 'date' || fieldDef?.type === 'amount')) {
      const [a, b] = value as [string, string];
      if (!a && !b) return '';
      if (fieldDef?.type === 'amount') return `$${a || '0'} – $${b || '∞'}`;
      return `${a || '…'} – ${b || '…'}`;
    }
    return (value as string[]).join(', ');
  }
  return String(value);
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  appliedConditions,
  fieldDefinitions,
  onRemove,
  onClearAll,
}) => {
  if (appliedConditions.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        py: 1,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontWeight: 600 }}>
        Applied:
      </Typography>
      {appliedConditions.map((cond) => {
        const fieldDef = fieldDefinitions.find((f) => f.key === cond.fieldKey);
        if (!fieldDef || !cond.fieldKey) return null;
        const valueStr = formatValue(cond, fieldDef);
        if (!valueStr) return null;

        return (
          <Chip
            key={cond.id}
            label={`${fieldDef.label} ${OPERATOR_LABELS[cond.operator]} ${valueStr}`}
            onDelete={() => onRemove(cond.id)}
            size="small"
            variant="filled"
            color="primary"
            sx={{ fontWeight: 500, fontSize: '0.72rem' }}
          />
        );
      })}
      <Chip
        label="Clear all"
        onClick={onClearAll}
        size="small"
        variant="outlined"
        sx={{ fontSize: '0.72rem', borderStyle: 'dashed' }}
      />
    </Box>
  );
};
