// ============================================================
// useDebounce.ts
// Generic debounce hook — delays propagating a value change by `delay` ms.
// Used by text inputs to avoid re-filtering on every keystroke.
// ============================================================

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
