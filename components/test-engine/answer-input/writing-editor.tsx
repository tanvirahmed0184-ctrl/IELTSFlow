"use client";

import { useCallback, useRef, useEffect } from "react";
import { Check, AlertCircle, Save, Loader2 } from "lucide-react";

interface WritingEditorProps {
  value: string;
  onChange: (value: string) => void;
  minWords: number;
  disabled?: boolean;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  lastSavedAt?: Date | null;
  placeholder?: string;
}

export function WritingEditor({
  value,
  onChange,
  minWords,
  disabled = false,
  isSaving = false,
  hasUnsavedChanges = false,
  lastSavedAt,
  placeholder = "Start writing your response here...",
}: WritingEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const meetsMinimum = wordCount >= minWords;
  const progress = Math.min(wordCount / minWords, 1);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  // Auto-resize textarea to content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 400)}px`;
  }, [value]);

  const formatSavedTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-sm">
      {/* Editor area */}
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck
          className="w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-[1.8] text-foreground outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ minHeight: "400px" }}
        />
      </div>

      {/* Word count progress bar */}
      <div className="mx-5 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-300 ${
            meetsMinimum ? "bg-green-500" : wordCount > 0 ? "bg-brand-purple" : "bg-transparent"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Footer status bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3 text-xs">
        {/* Left: word/char count */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            {meetsMinimum ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : wordCount > 0 ? (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            ) : null}
            <span className={`font-medium tabular-nums ${meetsMinimum ? "text-green-600" : "text-foreground"}`}>
              {wordCount}
            </span>
            <span className="text-muted-foreground">
              / {minWords} words
            </span>
          </span>

          <span className="text-muted-foreground tabular-nums">
            {charCount} chars
          </span>
        </div>

        {/* Right: save status */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving…</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Unsaved changes</span>
            </>
          ) : lastSavedAt ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span>Saved at {formatSavedTime(lastSavedAt)}</span>
            </>
          ) : (
            <span>Not saved yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
