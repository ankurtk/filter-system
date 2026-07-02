// FilterBuilder.tsx
// Root orchestrator for the filter panel.
// Manages the list of FilterConditionRows and exposes Add / Apply / Clear actions.
// Receives fieldDefinitions as the only external config — zero internal hardcoding.

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  Stack,
  Chip,
  Collapse,
} from '@mui/material';
import { Plus, SlidersHorizontal, X, CheckCheck } from 'lucide-react';

import { FilterConditionRow } from './FilterConditionRow';
import { useFilterState } from '../../hooks/useFilterState';
import type { FilterBuilderProps, FilterCondition } from '../../types/filter.types';

interface FilterBuilderComponentProps extends FilterBuilderProps {
  /** Active conditions that are currently applied to the table (for chip display) */
  appliedCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterBuilder: React.FC<FilterBuilderComponentProps> = ({
  fieldDefinitions,
  onApply,
  initialConditions,
  appliedCount,
  isOpen,
  onToggle,
}) => {
  const { conditions, addFilter, updateFilter, removeFilter, clearAll } =
    useFilterState(initialConditions);

  const handleApply = () => {
    onApply(conditions);
    onToggle(); // auto-collapse the filter panel
  };

  const handleClear = () => {
    clearAll();
    onApply([]);
  };

  // When a row is deleted via the dustbin icon we must also update the
  // applied conditions so the table resets immediately (without needing
  // the user to click "Apply Filters" again).
  const handleRemove = (id: string) => {
    removeFilter(id);
    onApply(conditions.filter((c) => c.id !== id));
  };

  return (
    <Box>
      {/* Toggle Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: isOpen ? 2 : 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant={isOpen ? 'contained' : 'outlined'}
            startIcon={<SlidersHorizontal size={16} />}
            onClick={onToggle}
            size="small"
            id="toggle-filter-panel-btn"
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Filters
          </Button>
          {appliedCount > 0 && (
            <Chip
              label={`${appliedCount} active`}
              size="small"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        {isOpen && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="text"
              color="inherit"
              startIcon={<X size={14} />}
              onClick={handleClear}
              disabled={conditions.length === 0}
              id="clear-all-filters-btn"
            >
              Clear All
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<CheckCheck size={14} />}
              onClick={handleApply}
              id="apply-filters-btn"
              sx={{ borderRadius: 2 }}
            >
              Apply Filters
            </Button>
          </Box>
        )}
      </Box>

      {/* Filter Panel */}
      <Collapse in={isOpen} timeout={250}>
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            p: 2,
            bgcolor: 'background.default',
          }}
        >
          {conditions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <SlidersHorizontal
                size={32}
                strokeWidth={1.2}
                style={{ opacity: 0.3, marginBottom: 8 }}
              />
              <Typography variant="body2" color="text.secondary">
                No filters added yet. Click "Add Filter" to get started.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {conditions.map((condition: FilterCondition, index) => (
                <React.Fragment key={condition.id}>
                  {index > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Divider sx={{ flex: 1 }} />
                      <Chip label="AND" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                      <Divider sx={{ flex: 1 }} />
                    </Box>
                  )}
                  <FilterConditionRow
                    condition={condition}
                    fieldDefinitions={fieldDefinitions}
                    onUpdate={updateFilter}
                    onRemove={handleRemove}
                  />
                </React.Fragment>
              ))}
            </Stack>
          )}

          {/* Add Filter Button */}
          <Box sx={{ mt: 2, pt: conditions.length > 0 ? 1.5 : 0 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Plus size={14} />}
              onClick={addFilter}
              id="add-filter-btn"
              sx={{ borderRadius: 2, borderStyle: 'dashed' }}
            >
              Add Filter
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
