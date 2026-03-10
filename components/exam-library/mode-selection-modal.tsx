"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SkillId = "listening" | "reading" | "writing";

interface ModeSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    mode: "practice" | "simulation",
    options?: { parts?: string[]; timeLimitMins?: number }
  ) => void;
  skill: SkillId;
  title: string;
}

const LISTENING_PARTS = [
  { id: "1", label: "Part 1" },
  { id: "2", label: "Part 2" },
  { id: "3", label: "Part 3" },
  { id: "4", label: "Part 4" },
];

const READING_PARTS = [
  { id: "1", label: "Passage 1" },
  { id: "2", label: "Passage 2" },
  { id: "3", label: "Passage 3" },
];

const WRITING_PARTS = [
  { id: "TASK_1", label: "Task 1" },
  { id: "TASK_2", label: "Task 2" },
];

const TIME_LIMITS = [20, 30, 45, 60];

export function ModeSelectionModal({
  open,
  onClose,
  onSelect,
  skill,
  title,
}: ModeSelectionModalProps) {
  const [practiceParts, setPracticeParts] = useState<string[]>([]);
  const [timeLimitMins, setTimeLimitMins] = useState(30);

  const parts =
    skill === "listening"
      ? LISTENING_PARTS
      : skill === "reading"
        ? READING_PARTS
        : WRITING_PARTS;

  const togglePart = (id: string) => {
    setPracticeParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Choose mode: {title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Practice Mode</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Customize which parts to practice and set your own time limit.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <span className="mb-2 block text-xs font-medium text-muted-foreground">
                  Select parts
                </span>
                <div className="flex flex-wrap gap-2">
                  {parts.map((p) => (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={practiceParts.includes(p.id)}
                        onChange={() => togglePart(p.id)}
                        className="rounded"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-xs font-medium text-muted-foreground">
                  Time limit (minutes)
                </span>
                <select
                  value={timeLimitMins}
                  onChange={(e) => setTimeLimitMins(Number(e.target.value))}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {TIME_LIMITS.map((m) => (
                    <option key={m} value={m}>
                      {m} min
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() =>
                onSelect("practice", {
                  parts: practiceParts.length > 0 ? practiceParts : undefined,
                  timeLimitMins,
                })
              }
            >
              Start Practice
            </Button>
          </div>

          <div className="rounded-lg border border-brand-purple/30 bg-brand-purple/5 p-4">
            <h3 className="font-medium">Simulation Mode</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Full standard exam — timed like the real IELTS test.
            </p>
            <Button
              className="mt-4 w-full bg-brand-purple hover:bg-brand-purple-dark"
              onClick={() => onSelect("simulation")}
            >
              Start Full Simulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
