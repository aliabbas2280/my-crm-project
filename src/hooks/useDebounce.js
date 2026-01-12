import { useState, useEffect } from 'react';

/**
 * Debounce a value by a specified delay
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} debouncedValue
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup timer if value or delay changes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
