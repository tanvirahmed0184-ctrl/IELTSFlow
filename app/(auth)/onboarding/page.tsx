"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Target, BookOpen, Calendar } from "lucide-react";

const BAND_OPTIONS = [6, 6.5, 7, 7.5, 8, 8.5, 9];
const VARIANT_OPTIONS = [
  { value: "ACADEMIC", label: "Academic", desc: "For university or professional registration" },
  { value: "GENERAL", label: "General Training", desc: "For work or immigration" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetBand, setTargetBand] = useState<number | null>(null);
  const [examVariant, setExamVariant] = useState<"ACADEMIC" | "GENERAL" | null>(null);
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role === "INSTRUCTOR" || data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
          router.replace("/dashboard/student/overview");
          return;
        }
        if (data.user.profile?.onboardingCompleted) {
          router.replace("/dashboard/student/overview");
          return;
        }
        setAuthChecked(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  async function saveAndNext() {
    setLoading(true);
    try {
      if (step === 1 && targetBand !== null) {
        await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetBand }),
        });
        setStep(2);
      } else if (step === 2 && examVariant) {
        await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examVariant }),
        });
        setStep(3);
      } else if (step === 3) {
        if (examDate) {
          await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ examDate }),
          });
        }
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ onboardingCompleted: true }),
        });
        router.push("/dashboard/student/overview");
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-brand-purple" />
            <CardTitle className="text-2xl">Welcome! Let&apos;s personalize your experience</CardTitle>
          </div>
          <CardDescription>
            Step {step} of 3 — Answer a few quick questions to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4 text-brand-teal" />
                What is your target IELTS band score?
              </div>
              <div className="flex flex-wrap gap-2">
                {BAND_OPTIONS.map((band) => (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setTargetBand(band)}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                      targetBand === band
                        ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                        : "border-border bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    {band}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-brand-teal" />
                Which IELTS variant are you taking?
              </div>
              <div className="space-y-2">
                {VARIANT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExamVariant(opt.value as "ACADEMIC" | "GENERAL")}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      examVariant === opt.value
                        ? "border-brand-purple bg-brand-purple/10"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-sm text-muted-foreground">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-brand-teal" />
                When is your exam date? (Optional)
              </div>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={loading}
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            onClick={saveAndNext}
            disabled={
              loading ||
              (step === 1 && targetBand === null) ||
              (step === 2 && !examVariant)
            }
            className="flex-1"
          >
            {loading
              ? "Saving…"
              : step === 3
                ? "Finish"
                : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
