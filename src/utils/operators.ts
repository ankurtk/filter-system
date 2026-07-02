// ============================================================
// operators.ts
// Maps each FieldType to its allowed operators and their labels.
// This is the single place to add new operators or field types.
// ============================================================

import type { FieldType, Operator, OperatorOption } from '../types/filter.types';

/** All operator definitions with display labels. */
export const OPERATOR_LABELS: Record<Operator, string> = {
  equals: 'Equals',
  notEquals: 'Does Not Equal',
  contains: 'Contains',
  doesNotContain: 'Does Not Contain',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  gt: 'Greater Than',
  lt: 'Less Than',
  gte: 'Greater Than or Equal',
  lte: 'Less Than or Equal',
  between: 'Between',
  is: 'Is',
  isNot: 'Is Not',
  in: 'In',
  notIn: 'Not In',
};

/** Operators available for each FieldType. Order determines dropdown order. */
const FIELD_TYPE_OPERATORS: Record<FieldType, Operator[]> = {
  text: ['contains', 'equals', 'doesNotContain', 'startsWith', 'endsWith', 'notEquals'],
  number: ['equals', 'gt', 'lt', 'gte', 'lte'],
  date: ['between'],
  amount: ['between'],
  select: ['is', 'isNot'],
  multiselect: ['in', 'notIn'],
  boolean: ['is'],
};

/**
 * Returns the list of { value, label } operator options for a given FieldType.
 * Used by FilterConditionRow to populate the operator dropdown.
 */
export function getOperatorsForFieldType(type: FieldType): OperatorOption[] {
  return FIELD_TYPE_OPERATORS[type].map((op) => ({
    value: op,
    label: OPERATOR_LABELS[op],
  }));
}

/**
 * Returns the default (first) operator for a given FieldType.
 * Used when a user changes the field selection.
 */
export function getDefaultOperator(type: FieldType): Operator {
  return FIELD_TYPE_OPERATORS[type][0];
}
