// FilterConditionRow.tsx
// Renders a single filter row: [Field Selector] [Operator Selector] [Value Input] [Delete]
// Value input is dynamically chosen based on the selected field's FieldType.

import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import { Trash2 } from 'lucide-react';

import type {
  FilterCondition,
  FilterFieldDefinition,
  Operator,
  FilterValue,
} from '../../types/filter.types';
import { getOperatorsForFieldType, getDefaultOperator } from '../../utils/operators';

import { TextFilterInput } from './inputs/TextFilterInput';
import { NumberFilterInput } from './inputs/NumberFilterInput';
import { DateRangeInput } from './inputs/DateRangeInput';
import { AmountRangeInput } from './inputs/AmountRangeInput';
import { SelectFilterInput } from './inputs/SelectFilterInput';
import { MultiSelectFilterInput } from './inputs/MultiSelectFilterInput';
import { BooleanFilterInput } from './inputs/BooleanFilterInput';

interface FilterConditionRowProps {
  condition: FilterCondition;
  fieldDefinitions: FilterFieldDefinition[];
  onUpdate: (payload: Partial<FilterCondition> & { id: string }) => void;
  onRemove: (id: string) => void;
}

/** Returns an empty/default value for a newly-selected field type. */
function getDefaultValue(type: string): FilterValue {
  switch (type) {
    case 'date':
    case 'amount':    return ['', ''];
    case 'multiselect': return [];
    case 'boolean':   return 'true';
    case 'number':    return '';
    default:          return '';
  }
}

/** Renders the appropriate input component for the active field type. */
function renderValueInput(
  condition: FilterCondition,
  fieldDef: FilterFieldDefinition | undefined,
  onUpdate: FilterConditionRowProps['onUpdate'],
) {
  if (!fieldDef) return null;

  const handleChange = (value: FilterValue) => {
    onUpdate({ id: condition.id, value });
  };

  switch (fieldDef.type) {
    case 'text':
      return (
        <TextFilterInput
          value={String(condition.value ?? '')}
          onChange={(v) => handleChange(v)}
        />
      );

    case 'number':
      return (
        <NumberFilterInput
          value={condition.value as number | string}
          onChange={(v) => handleChange(v as FilterValue)}
        />
      );

    case 'date':
      return (
        <DateRangeInput
          value={(condition.value as [string, string]) ?? ['', '']}
          onChange={(v) => handleChange(v)}
        />
      );

    case 'amount':
      return (
        <AmountRangeInput
          value={(condition.value as [string, string]) ?? ['', '']}
          onChange={(v) => handleChange(v)}
        />
      );

    case 'select':
      return (
        <SelectFilterInput
          value={String(condition.value ?? '')}
          onChange={(v) => handleChange(v)}
          options={fieldDef.options ?? []}
        />
      );

    case 'multiselect':
      return (
        <MultiSelectFilterInput
          value={(condition.value as string[]) ?? []}
          onChange={(v) => handleChange(v)}
          options={fieldDef.options ?? []}
        />
      );

    case 'boolean':
      return (
        <BooleanFilterInput
          value={String(condition.value ?? 'true')}
          onChange={(v) => handleChange(v)}
        />
      );

    default:
      return null;
  }
}

export const FilterConditionRow: React.FC<FilterConditionRowProps> = ({
  condition,
  fieldDefinitions,
  onUpdate,
  onRemove,
}) => {
  const selectedFieldDef = fieldDefinitions.find((f) => f.key === condition.fieldKey);
  const operators = selectedFieldDef
    ? getOperatorsForFieldType(selectedFieldDef.type)
    : [];

  const handleFieldChange = (newFieldKey: string) => {
    const newDef = fieldDefinitions.find((f) => f.key === newFieldKey);
    if (!newDef) return;
    onUpdate({
      id: condition.id,
      fieldKey: newFieldKey,
      operator: getDefaultOperator(newDef.type),
      value: getDefaultValue(newDef.type),
    });
  };

  const handleOperatorChange = (newOperator: Operator) => {
    onUpdate({ id: condition.id, operator: newOperator });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        flexWrap: 'wrap',
        borderRadius: 2,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 2 },
      }}
    >
      {/* Field Selector */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Field</InputLabel>
        <Select
          value={condition.fieldKey}
          label="Field"
          onChange={(e) => handleFieldChange(e.target.value)}
        >
          {fieldDefinitions.map((def) => (
            <MenuItem key={def.key} value={def.key}>
              {def.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Operator Selector */}
      {selectedFieldDef && (
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Operator</InputLabel>
          <Select
            value={condition.operator}
            label="Operator"
            onChange={(e) => handleOperatorChange(e.target.value as Operator)}
          >
            {operators.map((op) => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Dynamic Value Input */}
      {selectedFieldDef && (
        <Box sx={{ flex: 1, minWidth: 160 }}>
          {renderValueInput(condition, selectedFieldDef, onUpdate)}
        </Box>
      )}

      {/* Delete Button */}
      <Tooltip title="Remove filter">
        <IconButton
          size="small"
          onClick={() => onRemove(condition.id)}
          aria-label="remove filter condition"
          sx={{
            color: 'text.secondary',
            alignSelf: 'center',
            '&:hover': { color: 'error.main', bgcolor: 'error.lighter' },
          }}
        >
          <Trash2 size={16} />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};
