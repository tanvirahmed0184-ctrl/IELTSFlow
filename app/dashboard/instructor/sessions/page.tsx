"use client";

import { useState } from "react";
import { Calendar, Clock, User, Video, CheckCircle2, XCircle, MessageSquare, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

type TabType = "upcoming" | "past";

const UPCOMING_SESSIONS = [
  { id: "1", studentName: "Ahmed Rahman", date: "Mar 10, 2026", time: "10:00 AM", duration: 15, topic: "Speaking Part 2 - Describe a place", status: "confirmed" as const, meetingLink: "https://meet.google.com/abc" },
  { id: "2", studentName: "Maria Santos", date: "Mar 10, 2026", time: "2:00 PM", duration: 15, topic: "Speaking Full Mock", status: "confirmed" as const, meetingLink: "https://meet.google.com/def" },
  { id: "3", studentName: "Wei Chen", date: "Mar 11, 2026", time: "11:00 AM", duration: 15, topic: "Speaking Part 1 & 3", status: "pending" as const, meetingLink: null },
  { id: "4", studentName: "Priya Patel", date: "Mar 12, 2026", time: "3:00 PM", duration: 15, topic: "Speaking Full Mock", status: "confirmed" as const, meetingLink: "https://meet.google.com/ghi" },
];

const PAST_SESSIONS = [
  { id: "p1", studentName: "John Davis", date: "Mar 7, 2026", time: "9:00 AM", duration: 15, bandGiven: 6.5, hasEvaluation: true, status: "completed" as const },
  { id: "p2", studentName: "Sarah Kim", date: "Mar 6, 2026", time: "11:00 AM", duration: 15, bandGiven: 7.0, hasEvaluation: true, status: "completed" as const },
  { id: "p3", studentName: "Omar Hassan", date: "Mar 5, 2026", time: "2:00 PM", duration: 15, bandGiven: null, hasEvaluation: false, status: "completed" as const },
  { id: "p4", studentName: "Lisa Wang", date: "Mar 4, 2026", time: "10:00 AM", duration: 15, bandGiven: null, hasEvaluation: false, status: "no_show" as const },
];

const statusColors = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-blue-100 text-blue-700",
  no_show: "bg-red-100 text-red-700",
};

const statusLabels = {
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  no_show: "No Show",
};

export default function InstructorSessionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="text-muted-foreground mt-1">Manage your upcoming and past speaking sessions.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">This Week</div>
          <div className="mt-1 text-2xl font-extrabold">6</div>
          <p className="text-xs text-muted-foreground">sessions booked</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Review</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-600">2</div>
          <p className="text-xs text-muted-foreground">need evaluation</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Rating</div>
          <div className="mt-1 text-2xl font-extrabold flex items-center gap-1">4.9 <Star className="h-4 w-4 fill-amber-400 text-amber-400" /></div>
          <p className="text-xs text-muted-foreground">from 120 reviews</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Sessions</div>
          <div className="mt-1 text-2xl font-extrabold">248</div>
          <p className="text-xs text-muted-foreground">all time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex border-b">
          {(["upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-brand-purple text-brand-purple"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "upcoming" ? `Upcoming (${UPCOMING_SESSIONS.length})` : `Past (${PAST_SESSIONS.length})`}
            </button>
          ))}
        </div>

        {/* Upcoming sessions */}
        {activeTab === "upcoming" && (
          <div className="divide-y">
            {UPCOMING_SESSIONS.map((session) => (
              <div key={session.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-white">
                  {session.studentName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{session.studentName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[session.status]}`}>
                      {statusLabels[session.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time} ({session.duration}min)</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{session.topic}</div>
                </div>
                <div className="flex items-center gap-2">
                  {session.meetingLink && (
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-teal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-teal-dark">
                      <Video className="h-3.5 w-3.5" /> Join
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past sessions */}
        {activeTab === "past" && (
          <div className="divide-y">
            {PAST_SESSIONS.map((session) => (
              <div key={session.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {session.studentName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{session.studentName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[session.status]}`}>
                      {statusLabels[session.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.bandGiven != null && (
                    <span className="rounded-lg bg-brand-purple/10 px-3 py-1.5 text-xs font-bold text-brand-purple">
                      Band {session.bandGiven}
                    </span>
                  )}
                  {session.status === "completed" && !session.hasEvaluation && (
                    <Link href={`/dashboard/instructor/evaluations`}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-200">
                      <MessageSquare className="h-3.5 w-3.5" /> Evaluate
                    </Link>
                  )}
                  {session.hasEvaluation && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Evaluated
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
