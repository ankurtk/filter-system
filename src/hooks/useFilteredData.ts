import { useMemo } from 'react';
import { applyFilters } from '../utils/filterEngine';
import type { FilterCondition, FilterFieldDefinition } from '../types/filter.types';

function buildFieldTypeMap(
  fieldDefinitions: FilterFieldDefinition[],
): Record<string, string> {
  return fieldDefinitions.reduce<Record<string, string>>((acc, def) => {
    acc[def.key] = def.type;
    return acc;
  }, {});
}

/**
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
