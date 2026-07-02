// ============================================================
// filter.types.ts
// All TypeScript contracts for the dynamic filter system.
// These are the single source of truth — every component and
// hook references these types, never its own ad-hoc variants.
// ============================================================

// ─── Field Types ────────────────────────────────────────────
/**
 * Every column in a data table maps to exactly one FieldType.
 * The FieldType drives which operators and input components are rendered.
 */
export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'select'
  | 'multiselect'
  | 'boolean';

// ─── Operators ──────────────────────────────────────────────
/**
 * Full union of all possible filter operators across all field types.
 * Each FieldType only exposes a subset of these (see operators.ts).
 */
export type Operator =
  // Text operators
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'doesNotContain'
  | 'startsWith'
  | 'endsWith'
  // Number operators
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  // Range operators (date, amount)
  | 'between'
  // Select operators
  | 'is'
  | 'isNot'
  // Multi-select operators
  | 'in'
  | 'notIn';

/** Human-readable label for each operator, used in the dropdown. */
export interface OperatorOption {
  value: Operator;
  label: string;
}

// ─── Select Options ─────────────────────────────────────────
/** Represents one option in a select / multiselect dropdown. */
export interface SelectOption {
  value: string;
  label: string;
}

// ─── Filter Value ───────────────────────────────────────────
/**
 * The value stored for a filter condition depends on its field type:
 *   text / select / boolean  → string  (boolean stored as "true"/"false")
 *   number                   → number
 *   date / amount (between)  → [string, string] (ISO dates or numeric strings)
 *   multiselect              → string[]
 */
export type FilterValue = string | number | string[] | [string, string] | null;

// ─── Filter Field Definition ────────────────────────────────
/**
 * The external configuration unit.
 * One definition per filterable column. Passed as a prop to FilterBuilder.
 * Supports dot-notation keys for nested fields (e.g. "address.city").
 */
export interface FilterFieldDefinition {
  /** Dot-notation key matching the data field. e.g. "salary", "address.city" */
  key: string;
  /** Human-readable column label shown in the field dropdown. */
  label: string;
  /** Determines which operators and input component are shown. */
  type: FieldType;
  /** Required for 'select' and 'multiselect' field types. */
  options?: SelectOption[];
}

// ─── Filter Condition ───────────────────────────────────────
/**
 * Represents a single active filter row in the FilterBuilder.
 * Created with a uuid so React can key each row independently.
 */
export interface FilterCondition {
  /** Unique identifier for this condition (uuid). */
  id: string;
  /** References a FilterFieldDefinition.key */
  fieldKey: string;
  operator: Operator;
  value: FilterValue;
}

// ─── Filter State Actions ───────────────────────────────────
export type FilterAction =
  | { type: 'ADD_FILTER' }
  | { type: 'UPDATE_FILTER'; payload: Partial<FilterCondition> & { id: string } }
  | { type: 'REMOVE_FILTER'; payload: { id: string } }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_FILTERS'; payload: FilterCondition[] };

// ─── FilterBuilder Props ────────────────────────────────────
export interface FilterBuilderProps {
  /** Field definitions — the config that drives all rendering. */
  fieldDefinitions: FilterFieldDefinition[];
  /** Callback fired when the user clicks "Apply Filters". */
  onApply: (conditions: FilterCondition[]) => void;
  /** Optionally pre-populate conditions (e.g. from localStorage). */
  initialConditions?: FilterCondition[];
}
