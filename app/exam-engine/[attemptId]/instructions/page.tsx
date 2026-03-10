"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Headphones, BookOpen, PenLine, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const MODULE_INFO = {
  listening: {
    icon: Headphones,
    title: "IELTS Listening Test",
    duration: "About 30 minutes",
    items: [
      "You will hear 4 recordings. Each recording is played once only.",
      "Write your answers on the question paper while you listen.",
      "At the end, you have 10 minutes to transfer your answers to the answer sheet.",
      "This platform includes a 2-minute review timer after the final recording.",
    ],
  },
  reading: {
    icon: BookOpen,
    title: "IELTS Reading Test",
    duration: "60 minutes",
    items: [
      "3 passages with 40 questions in total.",
      "Answer all questions in the time given.",
      "You can navigate between passages and questions using the sidebar.",
      "Use 'Mark for Review' to flag questions you want to revisit.",
    ],
  },
  writing: {
    icon: PenLine,
    title: "IELTS Writing Test",
    duration: "60 minutes (Task 1: 20 min, Task 2: 40 min recommended)",
    items: [
      "Task 1: Write at least 150 words. Task 2: Write at least 250 words.",
      "Your word count is tracked automatically.",
      "Answers are autosaved. Submit when finished to receive AI evaluation.",
      "You will receive band scores for Task Achievement, Coherence, Lexical Resource, and Grammar.",
    ],
  },
};

export default function ExamInstructionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;
  const moduleParam = (searchParams.get("module") ?? "reading") as keyof typeof MODULE_INFO;
  const moduleKey = ["listening", "reading", "writing"].includes(moduleParam)
    ? moduleParam
    : "reading";
  const info = MODULE_INFO[moduleKey];
  const Icon = info.icon;

  function handleStart() {
    if (moduleKey === "listening") {
      router.push(`/test-engine/listening?attemptId=${attemptId}`);
    } else if (moduleKey === "reading") {
      router.push(`/test-engine/reading?attemptId=${attemptId}`);
    } else {
      router.push(`/test-engine/writing?attemptId=${attemptId}`);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <GraduationCap className="h-4 w-4" />
            IELTS Flow
          </Link>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple/10">
              <Icon className="h-6 w-6 text-brand-purple" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{info.title}</h1>
              <p className="text-sm text-muted-foreground">{info.duration}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold">General Instructions</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {info.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-brand-teal">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-lg border bg-muted/50 p-4">
            <h2 className="font-semibold">Platform features</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Question navigation sidebar with status colors (visited, answered, flagged)</li>
              <li>• Timer countdown</li>
              <li>• Auto-save and review before submit</li>
              <li>• AI band score feedback after submission (Writing & Speaking)</li>
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleStart}
            >
              Start Exam
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href={`/exam-library/${moduleKey}`}>
              <Button variant="outline" size="lg">
                Back to Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
