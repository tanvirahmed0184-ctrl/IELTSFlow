"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface McqQuestionResult {
  questionNumber: number;
  questionText: string;
  userAnswer: string | number | string[];
  correctAnswer: string | number | string[];
  isCorrect: boolean;
}

export interface WritingEvalResult {
  estimatedBand: number;
  criteria: {
    taskAchievement?: number;
    coherenceCohesion?: number;
    lexicalResource?: number;
    grammaticalRange?: number;
  };
  strengths: string[];
  mistakes: Array<{ original: string; correction: string; explanation: string }>;
  improvedRewrite?: string;
}

interface InstantResultViewProps {
  mode: "listening" | "reading" | "writing";
  isLoading?: boolean;
  mcqResults?: McqQuestionResult[];
  writingEval?: WritingEvalResult;
  bandScore?: number;
  correctCount?: number;
  totalCount?: number;
}

export function InstantResultView({
  mode,
  isLoading = false,
  mcqResults = [],
  writingEval,
  bandScore,
  correctCount = 0,
  totalCount = 0,
}: InstantResultViewProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
        <p className="mt-4 font-medium">AI is analyzing your answers...</p>
        <p className="mt-1 text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  const isWriting = mode === "writing";

  return (
    <div className="space-y-6">
      {/* Score summary */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold">Your Result</h3>
        {isWriting && writingEval ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold text-brand-purple">{writingEval.estimatedBand}</div>
              <div className="text-xs text-muted-foreground">Overall Band</div>
            </div>
            {Object.entries(writingEval.criteria).map(([name, score]) => (
              <div key={name} className="rounded-lg border p-3 text-center">
                <div className="text-xl font-bold">{score}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {name.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-4">
            <div className="text-3xl font-bold">{bandScore ?? "-"}</div>
            <div className="text-muted-foreground">
              {correctCount} / {totalCount} correct
            </div>
          </div>
        )}
      </div>

      {/* MCQ results: User vs Correct */}
      {mcqResults.length > 0 && (
        <div className="rounded-xl border bg-card">
          <h3 className="border-b px-4 py-3 font-semibold">Answers</h3>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {mcqResults.map((r) => (
              <div key={r.questionNumber} className="flex items-start gap-4 px-4 py-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                  {r.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-medium">Q{r.questionNumber}.</span>{" "}
                  {typeof r.userAnswer === "object" ? r.userAnswer.join(", ") : String(r.userAnswer)}
                  {!r.isCorrect && (
                    <span className="ml-2 text-green-700">
                      → Correct:{" "}
                      {typeof r.correctAnswer === "object"
                        ? (r.correctAnswer as string[]).join(", ")
                        : String(r.correctAnswer)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Writing: strengths, mistakes, rewrite */}
      {isWriting && writingEval && (
        <>
          {writingEval.strengths.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <h4 className="font-semibold text-green-700">Strengths</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {writingEval.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {writingEval.mistakes.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <h4 className="font-semibold text-amber-700">Corrections</h4>
              <div className="mt-3 space-y-2">
                {writingEval.mistakes.map((m, i) => (
                  <div key={i} className="rounded-lg border p-3 text-sm">
                    <span className="line-through text-red-600">{m.original}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium text-green-700">{m.correction}</span>
                    <p className="mt-1 text-xs text-muted-foreground">{m.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {writingEval.improvedRewrite && (
            <details className="rounded-xl border bg-card">
              <summary className="cursor-pointer px-4 py-3 font-semibold">Improved Rewrite</summary>
              <div className="border-t px-4 py-3 text-sm text-muted-foreground whitespace-pre-wrap">
                {writingEval.improvedRewrite}
              </div>
            </details>
          )}
        </>
      )}

      {/* CTA: SEE WHAT NEEDS TO IMPROVE */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/student/progress"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-6 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-brand-teal-dark"
        >
          SEE WHAT NEEDS TO IMPROVE
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link href={mode === "listening" ? "/exam-library/listening" : mode === "reading" ? "/exam-library/reading" : "/exam-library/writing"}>
          <Button variant="outline" size="lg">
            Back to Exam Library
          </Button>
        </Link>
      </div>
    </div>
  );
}
