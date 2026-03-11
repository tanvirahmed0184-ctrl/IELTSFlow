"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Headphones,
  PenLine,
  Search,
  GraduationCap,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeSelectionModal } from "@/components/exam-library/mode-selection-modal";

const SKILLS = [
  { id: "listening", label: "Listening", icon: Headphones, module: "LISTENING" },
  { id: "reading", label: "Reading", icon: BookOpen, module: "READING" },
  { id: "writing", label: "Writing", icon: PenLine, module: "WRITING" },
] as const;

type SkillId = (typeof SKILLS)[number]["id"];

interface TestItem {
  id: string;
  title: string;
  description?: string | null;
  variant: string;
  difficulty: string;
  durationMins: number;
  totalQuestions: number;
  isPractice: boolean;
  attemptCount: number;
}

interface WritingItem {
  id: string;
  title: string;
  taskType: string;
  variant: string;
  difficulty: string;
  topic?: string | null;
  attemptCount: number;
}

export default function ExamLibrarySkillPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = (params.skill as string)?.toLowerCase() as SkillId | "speaking";
  const skill = SKILLS.find((s) => s.id === skillId);

  useEffect(() => {
    if (skillId === "speaking") {
      router.replace("/dashboard/student/speaking");
      return;
    }
  }, [skillId, router]);

  const activeSkill = skill ?? SKILLS[0];

  const [search, setSearch] = useState("");
  const [tests, setTests] = useState<TestItem[]>([]);
  const [writingPrompts, setWritingPrompts] = useState<WritingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    title: string;
    type: "test" | "writing";
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (skillId === "writing") {
        const res = await fetch(
          `/api/writing/prompts?search=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setWritingPrompts(Array.isArray(data) ? data : []);
        setTests([]);
      } else {
        const res = await fetch(
          `/api/tests?module=${activeSkill.module}&search=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setTests(Array.isArray(data) ? data : []);
        setWritingPrompts([]);
      }
    } catch (e) {
      setTests([]);
      setWritingPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [skillId, activeSkill.module, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const items = skillId === "writing"
    ? writingPrompts.map((p) => ({
        id: p.id,
        title: p.title,
        type: "writing" as const,
        variant: p.variant,
        difficulty: p.difficulty,
        attemptCount: p.attemptCount,
        isFree: true,
      }))
    : tests.map((t) => ({
        id: t.id,
        title: t.title,
        type: "test" as const,
        variant: t.variant,
        difficulty: t.difficulty,
        attemptCount: t.attemptCount,
        isFree: t.isPractice,
        durationMins: t.durationMins,
        totalQuestions: t.totalQuestions,
      }));

  const sortedItems = [...items].sort((a, b) => {
    if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
    return (b.attemptCount ?? 0) - (a.attemptCount ?? 0);
  });

  function openModal(item: (typeof items)[number]) {
    setSelectedItem({
      id: item.id,
      title: item.title,
      type: item.type,
    });
    setModalOpen(true);
  }

  async function handleModeSelect(
    mode: "practice" | "simulation",
    _options?: { parts?: string[]; timeLimitMins?: number }
  ) {
    if (!selectedItem) return;

    try {
      const url =
        selectedItem.type === "writing"
          ? "/api/writing/attempt"
          : "/api/tests/attempt";
      const body =
        selectedItem.type === "writing"
          ? { promptId: selectedItem.id, mode }
          : {
              testId: selectedItem.id,
              mode,
              module:
                skillId === "listening"
                  ? "LISTENING"
                  : "READING",
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to start");
      }

      const { attemptId } = await res.json();
      setModalOpen(false);
      setSelectedItem(null);

      const module =
        skillId === "listening" ? "listening" : skillId === "reading" ? "reading" : "writing";
      window.location.href = `/exam-engine/${attemptId}/instructions?module=${module}`;
    } catch (e) {
      console.error(e);
      alert("Could not start the test. Please sign in and try again.");
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <GraduationCap className="h-4 w-4" />
            IELTS Flow
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Exam Library</h1>
          <p className="mt-2 text-muted-foreground">
            Choose a practice test or full simulation
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex rounded-lg border bg-background p-1">
            {SKILLS.map((s) => (
              <Link
                key={s.id}
                href={`/exam-library/${s.id}`}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  skillId === s.id
                    ? "bg-brand-purple text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </Link>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading tests...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Mock Test 1", "Mock Test 2", "Mock Test 3"].map((label, idx) => {
              const mockItem = {
                id: `mock-${skillId}-${idx + 1}`,
                title: `${activeSkill.label} ${label}`,
                type: "test" as const,
                variant: "ACADEMIC",
                difficulty: "MEDIUM",
                attemptCount: 0,
                isFree: true,
                durationMins: activeSkill.module === "LISTENING" ? 30 : 60,
                totalQuestions: activeSkill.module === "LISTENING" ? 40 : 40,
              };
              return (
                <div
                  key={mockItem.id}
                  className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{mockItem.title}</h3>
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Practice
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {`${mockItem.durationMins} min`}
                    </span>
                    <span>{mockItem.variant}</span>
                    <span className="capitalize">{mockItem.difficulty.toLowerCase()}</span>
                    <span>{mockItem.attemptCount} attempts</span>
                  </div>
                  <Button
                    className="mt-4 w-full"
                    size="sm"
                    onClick={() => openModal(mockItem)}
                  >
                    Start Test
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{item.title}</h3>
                  {item.isFree && (
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Free
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.type === "writing"
                      ? "Writing"
                      : `${item.durationMins} min`}
                  </span>
                  <span>{item.variant}</span>
                  <span className="capitalize">{item.difficulty.toLowerCase()}</span>
                  <span>{item.attemptCount} attempts</span>
                </div>
                <Button
                  className="mt-4 w-full"
                  size="sm"
                  onClick={() => openModal(item)}
                >
                  Start Test
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModeSelectionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onSelect={handleModeSelect}
        skill={skillId === "speaking" ? "listening" : skillId}
        title={selectedItem?.title ?? ""}
        hasStaticExams={sortedItems.length > 0}
      />
    </div>
  );
}
