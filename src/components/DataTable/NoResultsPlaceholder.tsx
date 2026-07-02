// NoResultsPlaceholder.tsx
// Friendly illustrated empty state when filter returns zero records.

import React from 'react';
import { Box, Typography } from '@mui/material';
import { SearchX } from 'lucide-react';

export const NoResultsPlaceholder: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
        color: 'text.secondary',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchX size={32} strokeWidth={1.3} />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
          No results found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
          Your current filters didn't match any records. Try adjusting or clearing your filters.
        </Typography>
      </Box>
    </Box>
  );
};
