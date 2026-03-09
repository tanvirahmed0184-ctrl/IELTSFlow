"use client";

interface WritingEditorProps {
  value: string;
  onChange: (value: string) => void;
  wordLimit?: number;
}

export function WritingEditor({ value, onChange, wordLimit }: WritingEditorProps) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[300px] w-full rounded-lg border p-4 text-sm"
        placeholder="Start writing your response..."
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Words: {wordCount}</span>
        {wordLimit && <span>Recommended: {wordLimit}+ words</span>}
      </div>
    </div>
  );
}
