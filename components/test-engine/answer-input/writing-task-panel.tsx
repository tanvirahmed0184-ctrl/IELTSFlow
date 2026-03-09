"use client";

import { FileText, Image as ImageIcon } from "lucide-react";

interface WritingTaskPanelProps {
  taskNumber: 1 | 2;
  taskType: string;
  promptText: string;
  imageUrl?: string | null;
  minWords: number;
}

export function WritingTaskPanel({
  taskNumber,
  taskType,
  promptText,
  imageUrl,
  minWords,
}: WritingTaskPanelProps) {
  const taskLabel =
    taskNumber === 1
      ? "Task 1 — You should spend about 20 minutes on this task."
      : "Task 2 — You should spend about 40 minutes on this task.";

  const taskTypeBadge =
    taskType === "TASK_1_ACADEMIC"
      ? "Academic"
      : taskType === "TASK_1_GENERAL"
        ? "General Training"
        : "Essay";

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-5 py-3 bg-muted/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple/10">
          <FileText className="h-4 w-4 text-brand-purple" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Writing Task {taskNumber}</h3>
            <span className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-[10px] font-semibold text-brand-purple uppercase tracking-wider">
              {taskTypeBadge}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{taskLabel}</p>
        </div>
      </div>

      {/* Prompt body */}
      <div className="px-5 py-4 space-y-4">
        {imageUrl && (
          <div className="relative overflow-hidden rounded-lg border bg-muted/30 p-1">
            <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
              <div className="text-center">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Chart / Graph / Diagram will appear here</p>
              </div>
            </div>
          </div>
        )}

        <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground">
          <p className="whitespace-pre-wrap">{promptText}</p>
        </div>

        <div className="rounded-lg bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground">
          Write at least <span className="font-semibold text-foreground">{minWords} words</span>.
        </div>
      </div>
    </div>
  );
}
