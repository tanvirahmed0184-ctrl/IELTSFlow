"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseAutosaveOptions {
  data: string;
  onSave: (data: string) => void | Promise<void>;
  intervalMs?: number;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutosave({
  data,
  onSave,
  intervalMs = 30_000,
  debounceMs = 2_000,
  enabled = true,
}: UseAutosaveOptions) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedDataRef = useRef(data);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onSaveRef = useRef(onSave);
  const dataRef = useRef(data);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const performSave = useCallback(async () => {
    const current = dataRef.current;
    if (current === lastSavedDataRef.current) return;
    if (!current.trim()) return;

    setIsSaving(true);
    try {
      await onSaveRef.current(current);
      lastSavedDataRef.current = current;
      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Track changes
  useEffect(() => {
    if (data !== lastSavedDataRef.current && data.trim()) {
      setHasUnsavedChanges(true);
    }
  }, [data]);

  // Debounced save on content change
  useEffect(() => {
    if (!enabled) return;
    if (data === lastSavedDataRef.current) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(performSave, debounceMs);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [data, debounceMs, enabled, performSave]);

  // Periodic interval save
  useEffect(() => {
    if (!enabled) return;

    intervalTimerRef.current = setInterval(performSave, intervalMs);

    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [intervalMs, enabled, performSave]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (dataRef.current !== lastSavedDataRef.current && dataRef.current.trim()) {
        onSaveRef.current(dataRef.current);
      }
    };
  }, []);

  const saveNow = useCallback(() => performSave(), [performSave]);

  return {
    lastSavedAt,
    isSaving,
    hasUnsavedChanges,
    saveNow,
  };
}
