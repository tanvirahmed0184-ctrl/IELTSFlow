"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QuestionNavPanel } from "@/components/test-engine/question-nav-panel";
import { MultipleChoice } from "@/components/test-engine/question-types/multiple-choice";
import { FillInBlank } from "@/components/test-engine/question-types/fill-in-blank";
import { InstantResultView } from "@/components/test-engine/instant-result-view";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type QuestionStatus = "not-visited" | "visited" | "answered" | "flagged";

interface Question {
  id: string;
  type: string;
  questionText: string;
  options?: string[];
  questionContext?: string | null;
}

interface Section {
  id: string;
  title: string;
  passage?: string | null;
  questions: Question[];
}

export function ReadingTestEngine() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [sections, setSections] = useState<Section[]>([]);
  const [phase, setPhase] = useState<"loading" | "in-progress" | "submitted" | "results">("loading");
  const [currentQ, setCurrentQ] = useState(1);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
  const [results, setResults] = useState<{
    correctCount: number;
    totalCount: number;
    bandScore: number;
    mcqResults?: Array<{ questionNumber: number; userAnswer: unknown; correctAnswer: unknown; isCorrect: boolean }>;
  } | null>(null);
  const [timeRemainingSecs, setTimeRemainingSecs] = useState(60 * 60);

  const allQuestions = sections.flatMap((s) => s.questions);
  const totalQ = allQuestions.length;

  useEffect(() => {
    if (!attemptId) {
      setPhase("loading");
      setSections([]);
      return;
    }
    fetch(`/api/attempts/${attemptId}/test`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        const test = d;
        const secs = test.sections ?? [];
        setSections(secs);
        setPhase("in-progress");
        setTimeRemainingSecs(60 * 60);
      })
      .catch(() => setSections([]))
      .finally(() => setPhase("in-progress"));
  }, [attemptId]);

  useEffect(() => {
    if (phase !== "in-progress" || timeRemainingSecs <= 0) return;
    const t = setInterval(() => setTimeRemainingSecs((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, timeRemainingSecs]);

  const handleAnswer = useCallback((qId: string, value: string) => {
    setAnswers((a) => ({ ...a, [qId]: value }));
    const idx = allQuestions.findIndex((q) => q.id === qId);
    if (idx >= 0) setStatuses((s) => ({ ...s, [idx + 1]: "answered" }));
  }, [allQuestions]);

  const handleQuestionClick = useCallback((n: number) => {
    setCurrentQ(n);
    setStatuses((s) => ({ ...s, [n]: "visited" }));
    const q = allQuestions[n - 1];
    if (q) {
      const secIdx = sections.findIndex((s) =>
        s.questions.some((sq) => sq.id === q.id)
      );
      if (secIdx >= 0) setCurrentSectionIdx(secIdx);
    }
  }, [allQuestions, sections]);

  const handleSubmit = useCallback(async () => {
    if (phase === "submitted" || phase === "results") return;
    setPhase("submitted");
    try {
      const answersPayload = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        givenAnswer: value,
      }));
      await fetch(`/api/attempts/${attemptId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersPayload }),
      });
      const res = await fetch(`/api/evaluate/${attemptId}`, { method: "POST" });
      const data = await res.json();
      if (data.correctCount != null) {
        setResults({
          correctCount: data.correctCount,
          totalCount: data.totalCount,
          bandScore: data.bandScore ?? 0,
          mcqResults: data.mcqResults,
        });
      }
    } catch {
      setResults({ correctCount: 0, totalCount: totalQ, bandScore: 0 });
    }
    setPhase("results");
  }, [attemptId, phase, totalQ, answers]);

  useEffect(() => {
    if (phase === "in-progress" && timeRemainingSecs === 0) {
      handleSubmit();
    }
  }, [phase, timeRemainingSecs, handleSubmit]);

  if (!attemptId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No attempt ID. Start from the Exam Library.</p>
        <Link href="/exam-library/reading">
          <Button>Go to Exam Library</Button>
        </Link>
      </div>
    );
  }

  if (phase === "loading" && sections.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  if (phase === "results" && results) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <InstantResultView
          mode="reading"
          correctCount={results.correctCount}
          totalCount={results.totalCount}
          bandScore={results.bandScore}
          mcqResults={results.mcqResults?.map((r) => ({
            questionNumber: r.questionNumber,
            questionText: "",
            userAnswer: r.userAnswer as string | number | string[],
            correctAnswer: r.correctAnswer as string | number | string[],
            isCorrect: r.isCorrect,
          }))}
        />
      </div>
    );
  }

  const q = allQuestions[currentQ - 1];
  const currentSection = sections[currentSectionIdx] ?? sections[0];
  const passage = currentSection?.passage ?? "";
  const m = Math.floor(timeRemainingSecs / 60);
  const s = timeRemainingSecs % 60;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4">
          <Link href="/exam-library/reading" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Reading</span>
          </Link>
          <div className={`font-mono text-lg ${timeRemainingSecs <= 300 ? "text-red-600" : ""}`}>
            {m}:{s.toString().padStart(2, "0")}
          </div>
          <Button size="sm" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      <div className="mx-auto grid h-[calc(100vh-3.5rem)] max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        <div className="overflow-y-auto border-r bg-card p-6">
          <h3 className="mb-4 font-semibold">{currentSection?.title ?? "Passage"}</h3>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
            {passage || "No passage available."}
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {q && (
              <div className="rounded-lg border bg-card p-6">
                <p className="mb-2 text-sm text-muted-foreground">
                  Question {currentQ} of {totalQ}
                </p>
                {q.type === "MULTIPLE_CHOICE" && q.options ? (
                  <MultipleChoice
                    questionId={q.id}
                    question={q.questionText}
                    options={q.options as string[]}
                    value={answers[q.id]}
                    onAnswer={handleAnswer}
                  />
                ) : (
                  <FillInBlank
                    questionId={q.id}
                    question={q.questionText}
                    value={answers[q.id]}
                    onAnswer={handleAnswer}
                  />
                )}
              </div>
            )}
          </div>
          <div className="border-t p-4">
            <QuestionNavPanel
              totalQuestions={totalQ || 1}
              questionStatuses={statuses}
              currentQuestion={currentQ}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
