// DataTable.tsx
// Sortable MUI table that displays employee records with support for:
//   - Click-to-sort on all columns
//   - Nested object display (address.city → "San Francisco")
//   - Array display as MUI Chips (skills[])
//   - Boolean display as colored Badge
//   - No-results empty state
//   - Record count in toolbar

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import type { Employee } from '../../types/employee.types';
import { NoResultsPlaceholder } from './NoResultsPlaceholder';

type Order = 'asc' | 'desc';

interface Column {
  id: keyof Employee | 'address.city' | 'address.state';
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

const COLUMNS: Column[] = [
  { id: 'name',              label: 'Name',         minWidth: 140, sortable: true },
  { id: 'department',        label: 'Department',   minWidth: 120, sortable: true },
  { id: 'role',              label: 'Role',         minWidth: 160, sortable: true },
  { id: 'salary',            label: 'Salary',       minWidth: 110, align: 'right', sortable: true },
  { id: 'joinDate',          label: 'Join Date',    minWidth: 110, sortable: true },
  { id: 'isActive',          label: 'Status',       minWidth: 90,  align: 'center', sortable: true },
  { id: 'skills',            label: 'Skills',       minWidth: 200, sortable: false },
  { id: 'address.city',      label: 'City',         minWidth: 120, sortable: true },
  { id: 'projects',          label: 'Projects',     minWidth: 90,  align: 'center', sortable: true },
  { id: 'performanceRating', label: 'Rating',       minWidth: 90,  align: 'center', sortable: true },
  { id: 'lastReview',        label: 'Last Review',  minWidth: 110, sortable: true },
];

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Record<string, unknown>)[k];
  }, obj);
}

function getCellValue(row: Employee, colId: string): unknown {
  return getNestedValue(row as unknown as Record<string, unknown>, colId);
}

function stableSort<T>(array: T[], compareFn: (a: T, b: T) => number): T[] {
  return array
    .map((el, index) => ({ el, index }))
    .sort((a, b) => {
      const order = compareFn(a.el, b.el);
      if (order !== 0) return order;
      return a.index - b.index;
    })
    .map(({ el }) => el);
}

function getComparator(order: Order, orderBy: string) {
  return (a: Employee, b: Employee): number => {
    const av = getCellValue(a, orderBy);
    const bv = getCellValue(b, orderBy);
    if (av === undefined || av === null) return 1;
    if (bv === undefined || bv === null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return order === 'asc' ? av - bv : bv - av;
    }
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    return order === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
  };
}

/** Renders a table cell value based on its type. */
function renderCell(colId: string, value: unknown) {
  if (value === undefined || value === null) return '—';

  if (colId === 'isActive') {
    return (
      <Chip
        label={value ? 'Active' : 'Inactive'}
        size="small"
        color={value ? 'success' : 'default'}
        variant={value ? 'filled' : 'outlined'}
        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
      />
    );
  }

  if (colId === 'salary') {
    return `$${Number(value).toLocaleString()}`;
  }

  if (colId === 'performanceRating') {
    const rating = Number(value);
    const color =
      rating >= 4.5 ? '#22c55e' : rating >= 3.5 ? '#f59e0b' : '#ef4444';
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontWeight: 700,
          color,
        }}
      >
        ★ {rating.toFixed(1)}
      </Box>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {(value as string[]).slice(0, 3).map((v) => (
          <Chip key={v} label={v} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
        ))}
        {value.length > 3 && (
          <Tooltip title={(value as string[]).slice(3).join(', ')}>
            <Chip label={`+${value.length - 3}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
          </Tooltip>
        )}
      </Box>
    );
  }

  return String(value);
}

interface DataTableProps {
  data: Employee[];
  totalCount: number;
  filteredCount: number;
}

export const DataTable: React.FC<DataTableProps> = ({ data, totalCount, filteredCount }) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');

  const handleSort = (colId: string) => {
    if (colId === orderBy) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(colId);
      setOrder('asc');
    }
  };

  const sortedData = useMemo(
    () => stableSort(data, getComparator(order, orderBy)),
    [data, order, orderBy],
  );

  return (
    <Box>
      {/* Record Count Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          px: 0.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing{' '}
          <strong style={{ color: 'inherit' }}>{filteredCount}</strong> of{' '}
          <strong style={{ color: 'inherit' }}>{totalCount}</strong> records
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader size="small" aria-label="employee data table">
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    style={{ minWidth: col.minWidth }}
                    sortDirection={orderBy === col.id ? order : false}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      bgcolor: 'background.paper',
                      borderBottom: 2,
                      borderColor: 'divider',
                      py: 1.5,
                    }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : 'asc'}
                        onClick={() => handleSort(col.id)}
                        id={`sort-${col.id}-btn`}
                      >
                        {col.label}
                        {orderBy === col.id && (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        )}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} sx={{ border: 0, p: 0 }}>
                    <NoResultsPlaceholder />
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      bgcolor: idx % 2 === 0 ? 'transparent' : 'action.hover',
                      '&:last-child td': { border: 0 },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    {COLUMNS.map((col) => {
                      const val = getCellValue(row, col.id);
                      return (
                        <TableCell
                          key={col.id}
                          align={col.align}
                          sx={{ py: 1, fontSize: '0.82rem' }}
                        >
                          {renderCell(col.id, val)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
