"use client";

import { Clock, AlertTriangle, Pause, Play } from "lucide-react";
import type { TimerUrgency, TimerStatus } from "@/hooks/useTestTimer";

interface WritingTimerProps {
  formatted: string;
  urgency: TimerUrgency;
  status: TimerStatus;
  progress: number;
  taskLabel: string;
  onPause?: () => void;
  onResume?: () => void;
}

const urgencyStyles: Record<TimerUrgency, { bar: string; text: string; bg: string; icon: string }> = {
  normal: {
    bar: "bg-brand-purple",
    text: "text-foreground",
    bg: "bg-card",
    icon: "text-brand-purple",
  },
  warning: {
    bar: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    icon: "text-amber-500",
  },
  danger: {
    bar: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    icon: "text-red-500",
  },
};

export function WritingTimer({
  formatted,
  urgency,
  status,
  progress,
  taskLabel,
  onPause,
  onResume,
}: WritingTimerProps) {
  const styles = urgencyStyles[urgency];
  const isPaused = status === "paused";
  const isFinished = status === "finished";

  return (
    <div className={`rounded-xl border shadow-sm transition-colors ${styles.bg}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          {urgency === "danger" ? (
            <AlertTriangle className={`h-5 w-5 ${styles.icon} ${!isFinished ? "animate-pulse" : ""}`} />
          ) : (
            <Clock className={`h-5 w-5 ${styles.icon}`} />
          )}
          <div>
            <div className="text-xs font-medium text-muted-foreground">{taskLabel}</div>
            <div className={`text-2xl font-mono font-bold tabular-nums tracking-tight ${styles.text} ${isFinished ? "text-red-600" : ""}`}>
              {isFinished ? "00:00" : formatted}
            </div>
          </div>
        </div>

        {(onPause || onResume) && !isFinished && (
          <button
            onClick={isPaused ? onResume : onPause}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={isPaused ? "Resume timer" : "Pause timer"}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-b-xl bg-muted">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${styles.bar}`}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
