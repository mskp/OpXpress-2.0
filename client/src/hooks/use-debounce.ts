import { useState, useEffect } from "react";

/**
 * Custom hook that debounces a value by a specified delay.
 *
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {T} - The debounced value.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value or delay changes or the component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

export default useDebounce;
