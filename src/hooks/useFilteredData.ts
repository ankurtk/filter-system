// ============================================================
// useFilteredData.ts
// Memoized hook that applies active filter conditions to a dataset.
// Re-computes only when data or appliedConditions change.
// ============================================================

import { useMemo } from 'react';
import { applyFilters } from '../utils/filterEngine';
import type { FilterCondition, FilterFieldDefinition } from '../types/filter.types';

/**
 * Builds a flat fieldKey → FieldType map from the field definitions array.
 * Memoized separately so it only recomputes when fieldDefinitions changes.
 */
function buildFieldTypeMap(
  fieldDefinitions: FilterFieldDefinition[],
): Record<string, string> {
  return fieldDefinitions.reduce<Record<string, string>>((acc, def) => {
    acc[def.key] = def.type;
    return acc;
  }, {});
}

/**
 * Hook that returns filtered data given a dataset, field definitions, and
 * the list of currently applied (not pending) filter conditions.
 *
 * @param data - Full dataset
 * @param appliedConditions - Conditions after the user clicked "Apply"
 * @param fieldDefinitions - Config for available filter fields
 */
export function useFilteredData<T extends Record<string, unknown>>(
  data: T[],
  appliedConditions: FilterCondition[],
  fieldDefinitions: FilterFieldDefinition[],
): { filteredData: T[]; totalCount: number; filteredCount: number } {
  const fieldTypeMap = useMemo(
    () => buildFieldTypeMap(fieldDefinitions),
    [fieldDefinitions],
  );

  const filteredData = useMemo(
    () => applyFilters(data, appliedConditions, fieldTypeMap),
    [data, appliedConditions, fieldTypeMap],
  );

  return {
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,
  };
}
