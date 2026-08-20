import { useState, useEffect } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of inactivity. Drop-in replacement for the inline debounce useEffect
 * pattern used across ViewLeadsPage and QuotesPage.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds (default: 300).
 *
 * @example
 * const debouncedSearch = useDebounce(search);          // 300ms default
 * const debouncedSearch = useDebounce(search, 500);     // custom delay
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}