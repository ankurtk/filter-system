// EmployeePage.tsx
// Main page that wires together:
//   - FilterBuilder (config-driven, reads EMPLOYEE_FILTER_CONFIG)
//   - ActiveFilterChips (summary of applied filters)
//   - DataTable (sortable, receives filtered data)
//   - ExportButtons
//
// Two-stage filter model:
//   - "pending" conditions live inside FilterBuilder (useFilterState)
//   - "applied" conditions are stored here and fed to useFilteredData
//   This prevents the table from re-filtering on every keystroke.

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import { Users } from 'lucide-react';

import { FilterBuilder } from '../components/FilterSystem/FilterBuilder';
import { ActiveFilterChips } from '../components/FilterSystem/ActiveFilterChips';
import { DataTable } from '../components/DataTable/DataTable';
import { ExportButtons } from '../components/DataTable/ExportButtons';
import { useFilteredData } from '../hooks/useFilteredData';
import { EMPLOYEE_FILTER_CONFIG } from '../config/employeeFilterConfig';

import employeesRaw from '../data/employees.json';
import type { Employee } from '../types/employee.types';
import type { FilterCondition } from '../types/filter.types';

// Cast the imported JSON to the Employee type
const ALL_EMPLOYEES = employeesRaw as Employee[];

export const EmployeePage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // "Applied" conditions are the source of truth for the table
  const [appliedConditions, setAppliedConditions] = useState<FilterCondition[]>([]);

  const { filteredData, totalCount, filteredCount } = useFilteredData(
    ALL_EMPLOYEES as unknown as Record<string, unknown>[],
    appliedConditions,
    EMPLOYEE_FILTER_CONFIG,
  );

  const handleApply = useCallback((conditions: FilterCondition[]) => {
    setAppliedConditions(conditions);
  }, []);

  const handleRemoveChip = useCallback((id: string) => {
    setAppliedConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setAppliedConditions([]);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              boxShadow: 3,
            }}
          >
            <Users size={24} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              Employee Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dynamic filter system — {totalCount} total employees
            </Typography>
          </Box>
        </Box>

        <ExportButtons
          data={filteredData as unknown as Employee[]}
          filename="employees_filtered"
        />
      </Box>

      {/* Filter Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <FilterBuilder
          fieldDefinitions={EMPLOYEE_FILTER_CONFIG}
          onApply={handleApply}
          appliedCount={appliedConditions.filter((c) => c.fieldKey).length}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen((v) => !v)}
        />

        {/* Active filter chip summary */}
        {appliedConditions.length > 0 && !isFilterOpen && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <ActiveFilterChips
              appliedConditions={appliedConditions}
              fieldDefinitions={EMPLOYEE_FILTER_CONFIG}
              onRemove={handleRemoveChip}
              onClearAll={handleClearAll}
            />
          </>
        )}
      </Paper>

      {/* Data Table */}
      <DataTable
        data={filteredData as unknown as Employee[]}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
    </Container>
  );
};
