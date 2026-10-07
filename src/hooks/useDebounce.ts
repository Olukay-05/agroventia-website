import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a fast-changing value by a specified delay (default 300ms).
 * Ensures search inputs and high-frequency UI updates do not trigger continuous re-filtering.
 *
 * @param value The value to debounce
 * @param delay Milliseconds to delay updating the debounced value (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
