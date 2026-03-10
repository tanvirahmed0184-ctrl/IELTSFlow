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
}

interface Section {
  id: string;
  title: string;
  audioUrl?: string | null;
  questions: Question[];
}

export function ListeningTestEngine() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [sections, setSections] = useState<Section[]>([]);
  const [audioEnded, setAudioEnded] = useState(false);
  const [reviewSecs, setReviewSecs] = useState(2 * 60);
  const [phase, setPhase] = useState<"loading" | "audio" | "review" | "submitted" | "results">("loading");
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
  const [results, setResults] = useState<{ correctCount: number; totalCount: number; bandScore: number; mcqResults?: Array<{ questionNumber: number; userAnswer: unknown; correctAnswer: unknown; isCorrect: boolean }> } | null>(null);

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
        setPhase("audio");
        setReviewSecs(2 * 60);
      })
      .catch(() => setSections([]))
      .finally(() => setPhase("audio"));
  }, [attemptId]);

  useEffect(() => {
    if (phase !== "review" || reviewSecs <= 0) return;
    const t = setInterval(() => setReviewSecs((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, reviewSecs]);

  const handleAudioEnd = useCallback(() => {
    setAudioEnded(true);
    setPhase("review");
  }, []);

  const handleAnswer = useCallback((qId: string, value: string) => {
    setAnswers((a) => ({ ...a, [qId]: value }));
    const idx = allQuestions.findIndex((q) => q.id === qId);
    if (idx >= 0) {
      setStatuses((s) => ({ ...s, [idx + 1]: "answered" }));
    }
  }, [allQuestions]);

  const handleQuestionClick = useCallback((n: number) => {
    setCurrentQ(n);
    setStatuses((s) => ({ ...s, [n]: "visited" }));
  }, []);

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
    if (phase === "review" && reviewSecs === 0) {
      handleSubmit();
    }
  }, [phase, reviewSecs, handleSubmit]);

  if (!attemptId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No attempt ID. Start from the Exam Library.</p>
        <Link href="/exam-library/listening">
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
          mode="listening"
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
  const m = Math.floor(reviewSecs / 60);
  const s = reviewSecs % 60;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/exam-library/listening" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Listening</span>
          </Link>
          <div className="font-mono text-lg">
            {phase === "review" ? (
              <span className={reviewSecs <= 60 ? "text-red-600" : ""}>
                Review: {m}:{s.toString().padStart(2, "0")}
              </span>
            ) : (
              <span>{phase === "audio" ? "Audio playing" : "—"}</span>
            )}
          </div>
          {phase === "review" && (
            <Button size="sm" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </div>

        {phase === "audio" && (
          <div className="border-t px-4 py-3">
            <audio
              controls
              autoPlay
              onEnded={handleAudioEnd}
              className="w-full"
            >
              {sections[0]?.audioUrl ? (
                <source src={sections[0].audioUrl} />
              ) : (
                <source src="/placeholder-audio.mp3" />
              )}
              Your browser does not support audio.
            </audio>
            <p className="mt-1 text-xs text-muted-foreground">
              Listen to the audio. After it ends, you have 2 minutes to review answers.
            </p>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {q && (
              <div className="rounded-lg border bg-card p-6">
                <p className="mb-2 text-sm text-muted-foreground">Question {currentQ} of {totalQ}</p>
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
          <QuestionNavPanel
            totalQuestions={totalQ || 1}
            questionStatuses={statuses}
            currentQuestion={currentQ}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </div>
  );
}
