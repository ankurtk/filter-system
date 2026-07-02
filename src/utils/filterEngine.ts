import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import type { FilterCondition, FilterValue, Operator } from '../types/filter.types';

dayjs.extend(isBetween);

// ─── Helpers ────────────────────────────────────────────────

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}
function toStr(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val).toLowerCase();
}

// ─── Per-Type Matchers ───────────────────────────────────────

/** Matches text field operators. */
function matchText(fieldValue: unknown, operator: Operator, filterValue: FilterValue): boolean {
  const fv = toStr(fieldValue);
  const tv = toStr(filterValue);

  switch (operator) {
    case 'equals': return fv === tv;
    case 'notEquals': return fv !== tv;
    case 'contains': return fv.includes(tv);
    case 'doesNotContain': return !fv.includes(tv);
    case 'startsWith': return fv.startsWith(tv);
    case 'endsWith': return fv.endsWith(tv);
    default: return false;
  }
}

/** Matches number field operators. */
function matchNumber(fieldValue: unknown, operator: Operator, filterValue: FilterValue): boolean {
  const fv = Number(fieldValue);
  const tv = Number(filterValue);

  if (isNaN(fv) || isNaN(tv)) return false;

  switch (operator) {
    case 'equals': return fv === tv;
    case 'notEquals': return fv !== tv;
    case 'gt': return fv > tv;
    case 'lt': return fv < tv;
    case 'gte': return fv >= tv;
    case 'lte': return fv <= tv;
    default: return false;
  }
}

/** Matches date 'between' operator using dayjs. */
function matchDate(fieldValue: unknown, _operator: Operator, filterValue: FilterValue): boolean {
  if (!Array.isArray(filterValue) || filterValue.length < 2) return true;
  const [from, to] = filterValue as [string, string];
  if (!from && !to) return true;

  const fieldDate = dayjs(String(fieldValue));
  if (!fieldDate.isValid()) return false;

  const fromDate = from ? dayjs(from) : null;
  const toDate = to ? dayjs(to).endOf('day') : null;

  if (fromDate && toDate) return fieldDate.isBetween(fromDate, toDate, 'day', '[]');
  if (fromDate) return fieldDate.isAfter(fromDate) || fieldDate.isSame(fromDate, 'day');
  if (toDate) return fieldDate.isBefore(toDate) || fieldDate.isSame(toDate, 'day');
  return true;
}

/** Matches amount 'between' operator (numeric range). */
function matchAmount(fieldValue: unknown, _operator: Operator, filterValue: FilterValue): boolean {
  if (!Array.isArray(filterValue) || filterValue.length < 2) return true;
  const [min, max] = filterValue as [string, string];
  const fv = Number(fieldValue);

  if (isNaN(fv)) return false;
  if (min !== '' && !isNaN(Number(min)) && fv < Number(min)) return false;
  if (max !== '' && !isNaN(Number(max)) && fv > Number(max)) return false;
  return true;
}

/** Matches select 'is' / 'isNot' operators. */
function matchSelect(fieldValue: unknown, operator: Operator, filterValue: FilterValue): boolean {
  const fv = String(fieldValue).toLowerCase();
  const tv = String(filterValue).toLowerCase();

  switch (operator) {
    case 'is': return fv === tv;
    case 'isNot': return fv !== tv;
    default: return false;
  }
}

function matchMultiSelect(
  fieldValue: unknown,
  operator: Operator,
  filterValue: FilterValue,
): boolean {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;

  const selected = (filterValue as string[]).map((v) => v.toLowerCase());
  const fieldArr = Array.isArray(fieldValue)
    ? (fieldValue as unknown[]).map((v) => String(v).toLowerCase())
    : [String(fieldValue).toLowerCase()];

  const hasMatch = selected.some((sel) => fieldArr.includes(sel));

  switch (operator) {
    case 'in': return hasMatch;
    case 'notIn': return !hasMatch;
    default: return false;
  }
}

/** Matches boolean 'is' operator (stored as "true"/"false" string). */
function matchBoolean(fieldValue: unknown, _operator: Operator, filterValue: FilterValue): boolean {
  const fv = String(fieldValue).toLowerCase();
  const tv = String(filterValue).toLowerCase();
  return fv === tv;
}

// ─── Single Condition Matcher ────────────────────────────────

export function matchCondition(
  record: Record<string, unknown>,
  condition: FilterCondition,
  fieldType: string,
): boolean {
  if (!condition.fieldKey || condition.value === null || condition.value === undefined) return true;
  if (typeof condition.value === 'string' && condition.value.trim() === '') return true;
  if (Array.isArray(condition.value) && condition.value.every((v) => v === '' || v === null)) return true;

  const fieldValue = getNestedValue(record, condition.fieldKey);

  switch (fieldType) {
    case 'text': return matchText(fieldValue, condition.operator, condition.value);
    case 'number': return matchNumber(fieldValue, condition.operator, condition.value);
    case 'date': return matchDate(fieldValue, condition.operator, condition.value);
    case 'amount': return matchAmount(fieldValue, condition.operator, condition.value);
    case 'select': return matchSelect(fieldValue, condition.operator, condition.value);
    case 'multiselect': return matchMultiSelect(fieldValue, condition.operator, condition.value);
    case 'boolean': return matchBoolean(fieldValue, condition.operator, condition.value);
    default: return true;
  }
}

// ─── Main Entry Point ────────────────────────────────────────

/**
 *
 * @param data - The full dataset array
 * @param conditions - Active filter conditions from useFilterState
 * @param fieldTypeMap - Map of fieldKey → FieldType (built from FilterFieldDefinition[])
 */
export function applyFilters<T extends Record<string, unknown>>(
  data: T[],
  conditions: FilterCondition[],
  fieldTypeMap: Record<string, string>,
): T[] {
  if (conditions.length === 0) return data;

  // Group conditions by fieldKey for OR-within-same-field logic
  const conditionsByField = conditions.reduce<Record<string, FilterCondition[]>>((acc, cond) => {
    if (!acc[cond.fieldKey]) acc[cond.fieldKey] = [];
    acc[cond.fieldKey].push(cond);
    return acc;
  }, {});

  return data.filter((record) => {
    // Every field group must pass (AND logic)
    return Object.entries(conditionsByField).every(([fieldKey, fieldConditions]) => {
      const fieldType = fieldTypeMap[fieldKey] ?? 'text';
      // At least one condition in this field group must pass (OR logic)
      return fieldConditions.some((cond) =>
        matchCondition(record as Record<string, unknown>, cond, fieldType),
      );
    });
  });
}
