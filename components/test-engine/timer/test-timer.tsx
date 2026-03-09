"use client";

interface TestTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
}

export function TestTimer({ totalSeconds, onTimeUp }: TestTimerProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-lg">
      {/* Timer display */}
      <span>00:00</span>
    </div>
  );
}
