"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Target,
  BookOpen,
  Headphones,
  PenLine,
  Mic,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

// Demo data
const STUDENT = {
  name: "John",
  targetBand: 7.5,
  examDate: "2026-05-15",
  currentOverall: 6.5,
};

const PROGRESS_DATA = [
  { month: "Oct", listening: 5.5, reading: 5.0, writing: 5.5, speaking: 5.0 },
  { month: "Nov", listening: 6.0, reading: 5.5, writing: 5.5, speaking: 5.5 },
  { month: "Dec", listening: 6.0, reading: 6.0, writing: 6.0, speaking: 5.5 },
  { month: "Jan", listening: 6.5, reading: 6.0, writing: 6.0, speaking: 6.0 },
  { month: "Feb", listening: 6.5, reading: 6.5, writing: 6.5, speaking: 6.0 },
  { month: "Mar", listening: 7.0, reading: 6.5, writing: 6.5, speaking: 6.5 },
];

const SKILL_DATA = [
  { skill: "Listening", score: 7.0, fullMark: 9 },
  { skill: "Reading", score: 6.5, fullMark: 9 },
  { skill: "Writing", score: 6.5, fullMark: 9 },
  { skill: "Speaking", score: 6.5, fullMark: 9 },
];

const RECENT_TESTS = [
  { id: "1", module: "Writing", type: "Task 2", band: 6.5, date: "Mar 8, 2026", status: "Evaluated" },
  { id: "2", module: "Listening", type: "Full Test", band: 7.0, date: "Mar 7, 2026", status: "Evaluated" },
  { id: "3", module: "Reading", type: "Academic", band: 6.5, date: "Mar 5, 2026", status: "Evaluated" },
  { id: "4", module: "Speaking", type: "AI Mock", band: 6.0, date: "Mar 3, 2026", status: "Evaluated" },
  { id: "5", module: "Writing", type: "Task 1", band: 6.5, date: "Mar 1, 2026", status: "Evaluated" },
];

const WEAKNESSES = [
  { area: "Speaking Pronunciation", severity: "high", tip: "Practice shadow reading for 15 min daily" },
  { area: "Writing Coherence", severity: "medium", tip: "Focus on linking words and paragraph structure" },
  { area: "Reading Speed", severity: "medium", tip: "Practice skimming techniques with timed passages" },
  { area: "Listening Section 4", severity: "low", tip: "Listen to academic lectures and take notes" },
];

const RECOMMENDED_ACTIONS = [
  { label: "Take a Writing Task 2 practice", href: "/test-engine/writing", icon: PenLine, priority: "high" },
  { label: "Practice Speaking Part 2 with AI", href: "/test-engine/speaking", icon: Mic, priority: "high" },
  { label: "Complete a Listening full test", href: "/test-engine/listening", icon: Headphones, priority: "medium" },
  { label: "Review Reading passage strategies", href: "/test-engine/reading", icon: BookOpen, priority: "low" },
];

const moduleIcons: Record<string, React.ElementType> = {
  Listening: Headphones,
  Reading: BookOpen,
  Writing: PenLine,
  Speaking: Mic,
};

const moduleColors: Record<string, string> = {
  Listening: "#3b82f6",
  Reading: "#10b981",
  Writing: "#f59e0b",
  Speaking: "#ef4444",
};

export default function StudentOverviewPage() {
  const [daysUntilExam] = useState(() => {
    const ms = new Date(STUDENT.examDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  });
  const readinessScore = Math.round((STUDENT.currentOverall / STUDENT.targetBand) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {STUDENT.name}!</h1>
        <p className="text-muted-foreground mt-1">
          {daysUntilExam > 0
            ? `Your IELTS exam is in ${daysUntilExam} days. Keep practicing!`
            : "Track your IELTS preparation progress here."}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Current Band", value: STUDENT.currentOverall.toString(), sub: "Overall predicted", icon: Award, color: "text-brand-purple", bg: "bg-brand-purple/10" },
          { label: "Target Band", value: STUDENT.targetBand.toString(), sub: `${daysUntilExam} days left`, icon: Target, color: "text-brand-teal", bg: "bg-brand-teal/10" },
          { label: "Readiness", value: `${readinessScore}%`, sub: readinessScore >= 90 ? "Exam ready!" : "Keep going", icon: Zap, color: readinessScore >= 90 ? "text-green-600" : "text-amber-600", bg: readinessScore >= 90 ? "bg-green-50" : "bg-amber-50" },
          { label: "Tests Taken", value: "24", sub: "This month: 8", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
              </div>
            </div>
            <div className="mt-2 text-3xl font-extrabold">{card.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress line chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Band Score Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={PROGRESS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[4, 9]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="listening" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Listening" />
              <Line type="monotone" dataKey="reading" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Reading" />
              <Line type="monotone" dataKey="writing" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Writing" />
              <Line type="monotone" dataKey="speaking" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Speaking" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Skill Balance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={SKILL_DATA} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 9]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: recent tests + sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent tests */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="text-sm font-semibold">Recent Tests</h3>
            <Link href="/dashboard/student/tests" className="text-xs font-medium text-brand-purple hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {RECENT_TESTS.map((test) => {
              const Icon = moduleIcons[test.module] ?? BookOpen;
              return (
                <div key={test.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${moduleColors[test.module]}15` }}>
                    <Icon className="h-4 w-4" style={{ color: moduleColors[test.module] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{test.module} — {test.type}</div>
                    <div className="text-xs text-muted-foreground">{test.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{test.band}</div>
                    <div className="text-[10px] text-green-600 font-medium">{test.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: weaknesses + actions */}
        <div className="space-y-6">
          {/* Weaknesses */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <h3 className="text-sm font-semibold">Weakness Analysis</h3>
            </div>
            <div className="p-4 space-y-2.5">
              {WEAKNESSES.map((w) => (
                <div key={w.area} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{w.area}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      w.severity === "high" ? "bg-red-100 text-red-700" :
                      w.severity === "medium" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {w.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{w.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended actions */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <h3 className="text-sm font-semibold">Recommended Actions</h3>
            </div>
            <div className="p-4 space-y-2">
              {RECOMMENDED_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 group"
                >
                  <action.icon className="h-4 w-4 text-brand-purple shrink-0" />
                  <span className="text-xs flex-1">{action.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
