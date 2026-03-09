"use client";

type QuestionStatus = "not-visited" | "visited" | "answered" | "flagged";

interface QuestionNavPanelProps {
  totalQuestions: number;
  questionStatuses: Record<number, QuestionStatus>;
  currentQuestion: number;
  onQuestionClick: (questionNumber: number) => void;
}

const statusColors: Record<QuestionStatus, string> = {
  "not-visited": "bg-gray-200 text-gray-600",
  "visited": "bg-yellow-200 text-yellow-800",
  "answered": "bg-green-200 text-green-800",
  "flagged": "bg-red-200 text-red-800",
};

export function QuestionNavPanel({
  totalQuestions,
  questionStatuses,
  currentQuestion,
  onQuestionClick,
}: QuestionNavPanelProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h4 className="font-semibold mb-3">Questions</h4>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const status = questionStatuses[num] || "not-visited";
          const isActive = num === currentQuestion;
          return (
            <button
              key={num}
              onClick={() => onQuestionClick(num)}
              className={`h-10 w-10 rounded-md text-sm font-medium transition-colors ${statusColors[status]} ${isActive ? "ring-2 ring-primary" : ""}`}
            >
              {num}
            </button>
          );
        })}
      </div>
      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-gray-200" /> Not visited</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-yellow-200" /> Visited</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-green-200" /> Answered</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-red-200" /> Flagged for review</div>
      </div>
    </div>
  );
}
