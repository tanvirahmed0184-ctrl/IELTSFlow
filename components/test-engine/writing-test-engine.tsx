"use client";

import { useState, useCallback, useMemo } from "react";
import { useTestTimer } from "@/hooks/useTestTimer";
import { useAutosave } from "@/hooks/useAutosave";
import { WritingTimer } from "@/components/test-engine/timer/writing-timer";
import { WritingTaskPanel } from "@/components/test-engine/answer-input/writing-task-panel";
import { WritingEditor } from "@/components/test-engine/answer-input/writing-editor";
import {
  WRITING_DURATION_SECS,
  WRITING_TASK1_MIN_WORDS,
  WRITING_TASK2_MIN_WORDS,
  WRITING_AUTOSAVE_INTERVAL_MS,
} from "@/utils/constants";
import {
  GraduationCap,
  ChevronLeft,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────
interface WritingTask {
  id: string;
  taskNumber: 1 | 2;
  taskType: string;
  promptText: string;
  imageUrl?: string | null;
  minWords: number;
}

interface WritingTestEngineProps {
  tasks?: WritingTask[];
  attemptId?: string;
  variant?: string;
  initialResponses?: Record<string, string>;
}

type TestPhase = "ready" | "active" | "review" | "submitted";

// ─── Sample tasks for demo when no real data is passed ──────────
const DEMO_TASKS: WritingTask[] = [
  {
    id: "demo-task-1",
    taskNumber: 1,
    taskType: "TASK_1_ACADEMIC",
    promptText:
      "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    imageUrl: "/placeholder-chart.png",
    minWords: WRITING_TASK1_MIN_WORDS,
  },
  {
    id: "demo-task-2",
    taskNumber: 2,
    taskType: "TASK_2",
    promptText:
      "Some people believe that universities should focus on providing academic skills and theoretical knowledge, while others think they should prepare students for employment.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
    minWords: WRITING_TASK2_MIN_WORDS,
  },
];

// ─── Main component ─────────────────────────────────────────────
export function WritingTestEngine({
  tasks = DEMO_TASKS,
  attemptId: _attemptId,
  variant = "ACADEMIC",
  initialResponses = {},
}: WritingTestEngineProps) {
  const [phase, setPhase] = useState<TestPhase>("ready");
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const t of tasks) {
      init[t.id] = initialResponses[t.id] ?? "";
    }
    return init;
  });
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, { savedAt: Date; wordCount: number }[]>>({});

  const activeTask = tasks[activeTaskIndex];
  const activeResponse = responses[activeTask.id] ?? "";

  // ─── Timer ──────────────────────────────────────────────────
  const timer = useTestTimer({
    initialSeconds: WRITING_DURATION_SECS,
    onTimeUp: () => handleSubmit(),
    warningThresholdSecs: 300,
    dangerThresholdSecs: 60,
    autoStart: false,
  });

  // ─── Autosave ───────────────────────────────────────────────
  const autosavePayload = useMemo(
    () => JSON.stringify({ taskId: activeTask.id, text: activeResponse }),
    [activeTask.id, activeResponse]
  );

  const handleDraftSave = useCallback(
    (data: string) => {
      const parsed = JSON.parse(data) as { taskId: string; text: string };
      const wordCount = parsed.text.trim().split(/\s+/).filter(Boolean).length;

      setDrafts((prev) => ({
        ...prev,
        [parsed.taskId]: [
          ...(prev[parsed.taskId] ?? []),
          { savedAt: new Date(), wordCount },
        ],
      }));

      // TODO: When connected to backend, POST to /api/tests/writing/draft
      // await fetch("/api/tests/writing/draft", {
      //   method: "POST",
      //   body: JSON.stringify({ attemptId, taskId: parsed.taskId, content: parsed.text, wordCount }),
      // });
    },
    []
  );

  const autosave = useAutosave({
    data: autosavePayload,
    onSave: handleDraftSave,
    intervalMs: WRITING_AUTOSAVE_INTERVAL_MS,
    debounceMs: 2000,
    enabled: phase === "active",
  });

  // ─── Handlers ───────────────────────────────────────────────
  const handleStartTest = useCallback(() => {
    setPhase("active");
    timer.start();
  }, [timer]);

  const handleResponseChange = useCallback(
    (text: string) => {
      setResponses((prev) => ({ ...prev, [activeTask.id]: text }));
    },
    [activeTask.id]
  );

  const handleSwitchTask = useCallback(
    (index: number) => {
      autosave.saveNow();
      setActiveTaskIndex(index);
    },
    [autosave]
  );

  const handleSubmit = useCallback(() => {
    autosave.saveNow();
    timer.pause();
    setPhase("submitted");
    setShowSubmitConfirm(false);

    // TODO: POST to /api/tests/writing/submit
    // Triggers AI evaluation via BullMQ queue
  }, [autosave, timer]);

  // ─── Word counts ────────────────────────────────────────────
  const wordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tasks) {
      const text = responses[t.id] ?? "";
      counts[t.id] = text.trim() ? text.trim().split(/\s+/).length : 0;
    }
    return counts;
  }, [tasks, responses]);

  const totalWords = Object.values(wordCounts).reduce((a, b) => a + b, 0);

  // ─── Ready screen ──────────────────────────────────────────
  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
          <div className="rounded-2xl border bg-card p-8 shadow-lg sm:p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-purple/10">
              <GraduationCap className="h-8 w-8 text-brand-purple" />
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">IELTS Writing Test</h1>
            <p className="mt-3 text-muted-foreground">
              {variant === "ACADEMIC" ? "Academic" : "General Training"} Writing Module
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 text-left">
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</div>
                <div className="mt-1 text-lg font-bold">60 minutes</div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tasks</div>
                <div className="mt-1 text-lg font-bold">2 Tasks</div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Task 1</div>
                <div className="mt-1 text-lg font-bold">150+ words</div>
                <div className="text-xs text-muted-foreground">~20 minutes</div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Task 2</div>
                <div className="mt-1 text-lg font-bold">250+ words</div>
                <div className="text-xs text-muted-foreground">~40 minutes</div>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-4 text-left text-sm text-amber-800">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Important</p>
                  <p className="mt-1 text-amber-700">
                    The timer starts when you click &quot;Begin Test&quot; and cannot be paused.
                    Your work is automatically saved every 30 seconds.
                    The test will auto-submit when time runs out.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-purple-dark hover:shadow-xl hover:-translate-y-0.5"
            >
              Begin Writing Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Submitted screen ──────────────────────────────────────
  if (phase === "submitted") {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
          <div className="rounded-2xl border bg-card p-8 shadow-lg sm:p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">Test Submitted!</h1>
            <p className="mt-3 text-muted-foreground">
              Your writing responses have been submitted for AI evaluation.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-lg border bg-muted/40 p-4 text-left">
                  <div className="text-xs font-medium text-muted-foreground">Task {task.taskNumber}</div>
                  <div className="mt-1 text-lg font-bold">{wordCounts[task.id]} words</div>
                  <div className={`text-xs ${wordCounts[task.id] >= task.minWords ? "text-green-600" : "text-amber-600"}`}>
                    {wordCounts[task.id] >= task.minWords ? "Minimum met" : `Below ${task.minWords} minimum`}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
              Your responses are being evaluated by our AI. This typically takes 30-60 seconds.
              You&apos;ll receive detailed feedback including predicted band scores for each criterion.
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/student/tests"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-purple-dark"
              >
                View My Results
              </Link>
              <Link
                href="/dashboard/student/practice"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Back to Practice
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active test UI ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/student/practice"
              className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-brand-purple" />
              <span className="hidden text-sm font-semibold sm:inline">IELTS Writing</span>
            </div>
          </div>

          {/* Center: task tabs */}
          <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
            {tasks.map((task, i) => {
              const wc = wordCounts[task.id];
              const met = wc >= task.minWords;
              const isActive = i === activeTaskIndex;
              return (
                <button
                  key={task.id}
                  onClick={() => handleSwitchTask(i)}
                  className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Task {task.taskNumber}</span>
                  <span className="sm:hidden">T{task.taskNumber}</span>
                  {wc > 0 && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                        met
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {wc}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: submit */}
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-teal px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-teal-dark hover:shadow-md"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Submit Test</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left column: task prompt + editor */}
          <div className="space-y-6">
            <WritingTaskPanel
              taskNumber={activeTask.taskNumber}
              taskType={activeTask.taskType}
              promptText={activeTask.promptText}
              imageUrl={activeTask.imageUrl}
              minWords={activeTask.minWords}
            />

            <WritingEditor
              value={activeResponse}
              onChange={handleResponseChange}
              minWords={activeTask.minWords}
              disabled={phase !== "active"}
              isSaving={autosave.isSaving}
              hasUnsavedChanges={autosave.hasUnsavedChanges}
              lastSavedAt={autosave.lastSavedAt}
            />
          </div>

          {/* Right column: timer + stats sidebar */}
          <div className="space-y-4">
            <WritingTimer
              formatted={timer.formatted}
              urgency={timer.urgency}
              status={timer.status}
              progress={timer.progress}
              taskLabel="Total Time Remaining"
            />

            {/* Task progress cards */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="border-b px-4 py-3">
                <h4 className="text-sm font-semibold">Task Progress</h4>
              </div>
              <div className="p-4 space-y-3">
                {tasks.map((task, i) => {
                  const wc = wordCounts[task.id];
                  const met = wc >= task.minWords;
                  const pct = Math.min(wc / task.minWords, 1);
                  const isActive = i === activeTaskIndex;
                  return (
                    <button
                      key={task.id}
                      onClick={() => handleSwitchTask(i)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        isActive ? "border-brand-purple/40 bg-brand-purple/5 ring-1 ring-brand-purple/20" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Task {task.taskNumber}</span>
                        <span className={`text-xs font-medium ${met ? "text-green-600" : "text-muted-foreground"}`}>
                          {wc}/{task.minWords}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${met ? "bg-green-500" : "bg-brand-purple"}`}
                          style={{ width: `${pct * 100}%` }}
                        />
                      </div>
                      {met && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-green-600 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Minimum reached
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick stats */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="border-b px-4 py-3">
                <h4 className="text-sm font-semibold">Quick Stats</h4>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total words</span>
                  <span className="font-medium tabular-nums">{totalWords}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time elapsed</span>
                  <span className="font-medium tabular-nums">
                    {String(Math.floor(timer.elapsed / 60)).padStart(2, "0")}:
                    {String(timer.elapsed % 60).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Drafts saved</span>
                  <span className="font-medium tabular-nums">
                    {Object.values(drafts).flat().length}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips card */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="border-b px-4 py-3">
                <h4 className="text-sm font-semibold">Writing Tips</h4>
              </div>
              <ul className="p-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-brand-purple font-bold">1.</span>
                  Spend ~20 min on Task 1, ~40 min on Task 2
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-purple font-bold">2.</span>
                  Plan before writing — outline your key points
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-purple font-bold">3.</span>
                  Task 2 carries more weight in scoring
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-purple font-bold">4.</span>
                  Use a range of vocabulary and grammar structures
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-purple font-bold">5.</span>
                  Leave 2-3 minutes at the end to review
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Submit Writing Test?</h3>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {tasks.map((task) => {
                const wc = wordCounts[task.id];
                const met = wc >= task.minWords;
                return (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm font-medium">Task {task.taskNumber}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold tabular-nums ${met ? "text-green-600" : "text-amber-600"}`}>
                        {wc} words
                      </span>
                      {met ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {tasks.some((t) => wordCounts[t.id] < t.minWords) && (
              <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <strong>Warning:</strong> One or more tasks haven&apos;t reached the minimum word count.
                You can still submit, but this may affect your band score.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Continue Writing
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-teal-dark"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
