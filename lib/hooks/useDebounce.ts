"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => cancel, [cancel]);

  return useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = setTimeout(() => callback(...args), delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancel, delay]
  ) as T;
}
