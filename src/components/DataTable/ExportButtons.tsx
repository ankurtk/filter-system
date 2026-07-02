// ExportButtons.tsx
// CSV and JSON export buttons for the filtered dataset.
// Creates a Blob download — works entirely client-side, no server needed.

import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { Download } from 'lucide-react';
import type { Employee } from '../../types/employee.types';

interface ExportButtonsProps {
  data: Employee[];
  filename?: string;
}

function exportCSV(data: Employee[], filename: string) {
  if (data.length === 0) return;

  // Flatten nested objects for CSV
  const flatten = (row: Employee) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    role: row.role,
    salary: row.salary,
    joinDate: row.joinDate,
    isActive: row.isActive,
    skills: row.skills.join(' | '),
    city: row.address.city,
    state: row.address.state,
    country: row.address.country,
    projects: row.projects,
    lastReview: row.lastReview,
    performanceRating: row.performanceRating,
  });

  const flat = data.map(flatten);
  const headers = Object.keys(flat[0]).join(',');
  const rows = flat.map((r) =>
    Object.values(r)
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  );

  const csv = [headers, ...rows].join('\n');
  downloadBlob(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

function exportJSON(data: Employee[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadBlob(json, `${filename}.json`, 'application/json');
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  filename = 'employees',
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title={data.length === 0 ? 'No data to export' : `Export ${data.length} records as CSV`}>
        <span>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Download size={14} />}
            onClick={() => exportCSV(data, filename)}
            disabled={data.length === 0}
            id="export-csv-btn"
            sx={{ borderRadius: 2 }}
          >
            CSV
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={data.length === 0 ? 'No data to export' : `Export ${data.length} records as JSON`}>
        <span>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Download size={14} />}
            onClick={() => exportJSON(data, filename)}
            disabled={data.length === 0}
            id="export-json-btn"
            sx={{ borderRadius: 2 }}
          >
            JSON
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};
