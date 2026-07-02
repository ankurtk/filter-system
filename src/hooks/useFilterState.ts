import { useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { FilterCondition, FilterAction } from '../types/filter.types';

const STORAGE_KEY = 'filter-system:conditions';

function filterReducer(state: FilterCondition[], action: FilterAction): FilterCondition[] {
  switch (action.type) {
    case 'ADD_FILTER':
      // Append a blank condition — the row will be incomplete until user fills it
      return [
        ...state,
        {
          id: uuidv4(),
          fieldKey: '',
          operator: 'contains',
          value: null,
        },
      ];

    case 'UPDATE_FILTER':
      return state.map((cond) =>
        cond.id === action.payload.id ? { ...cond, ...action.payload } : cond,
      );

    case 'REMOVE_FILTER':
      return state.filter((cond) => cond.id !== action.payload.id);

    case 'CLEAR_ALL':
      return [];

    case 'SET_FILTERS':
      return action.payload;

    default:
      return state;
  }
}

/** Loads persisted conditions from localStorage, returning [] on failure. */
function loadFromStorage(): FilterCondition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FilterCondition[];
  } catch {
    return [];
  }
}

/**
 * @param initialConditions 
 */
export function useFilterState(initialConditions?: FilterCondition[]) {
  const [conditions, dispatch] = useReducer(
    filterReducer,
    initialConditions ?? loadFromStorage(),
  );

  // Persist to localStorage whenever conditions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conditions));
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }, [conditions]);

  return {
    conditions,
    addFilter: () => dispatch({ type: 'ADD_FILTER' }),
    updateFilter: (payload: Partial<FilterCondition> & { id: string }) =>
      dispatch({ type: 'UPDATE_FILTER', payload }),
    removeFilter: (id: string) => dispatch({ type: 'REMOVE_FILTER', payload: { id } }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
    setFilters: (filters: FilterCondition[]) => dispatch({ type: 'SET_FILTERS', payload: filters }),
  };
}
