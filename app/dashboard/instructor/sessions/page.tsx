"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Video, CheckCircle2, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { formatDateLocal, formatTimeLocal } from "@/lib/datetime";

const tz = "UTC";

interface Booking {
  id: string;
  scheduledAt: string;
  durationMins: number;
  status: string;
  meetingLink: string | null;
  studentNotes: string | null;
  student: { id: string; name: string | null; email: string };
}

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  NO_SHOW: "bg-red-100 text-red-700",
  CANCELLED_BY_STUDENT: "bg-gray-100 text-gray-600",
  CANCELLED_BY_INSTRUCTOR: "bg-gray-100 text-gray-600",
};

export default function InstructorSessionsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    fetch("/api/booking?as=instructor")
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => new Date(b.scheduledAt) >= now && !["CANCELLED_BY_STUDENT", "CANCELLED_BY_INSTRUCTOR"].includes(b.status)
  );
  const past = bookings.filter((b) => new Date(b.scheduledAt) < now || ["CANCELLED_BY_STUDENT", "CANCELLED_BY_INSTRUCTOR"].includes(b.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="mt-1 text-muted-foreground">Manage your upcoming and past speaking sessions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">This Week</div>
          <div className="mt-1 text-2xl font-extrabold">{upcoming.filter((b) => {
            const d = new Date(b.scheduledAt);
            const weekEnd = new Date(now);
            weekEnd.setDate(weekEnd.getDate() + 7);
            return d < weekEnd;
          }).length}</div>
          <p className="text-xs text-muted-foreground">sessions booked</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Upcoming</div>
          <div className="mt-1 text-2xl font-extrabold">{upcoming.length}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</div>
          <div className="mt-1 text-2xl font-extrabold">{bookings.length}</div>
        </div>
      </div>

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
              {tab === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-muted-foreground">Loading...</div>
        ) : activeTab === "upcoming" ? (
          <div className="divide-y">
            {upcoming.length === 0 ? (
              <div className="px-5 py-8 text-center text-muted-foreground">No upcoming sessions.</div>
            ) : (
              upcoming.map((b) => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-white">
                    {(b.student.name ?? b.student.email).split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{b.student.name ?? b.student.email}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[b.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateLocal(new Date(b.scheduledAt), tz)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeLocal(new Date(b.scheduledAt), tz)} ({b.durationMins}min)
                      </span>
                    </div>
                    {b.studentNotes && (
                      <div className="text-xs text-muted-foreground mt-0.5">{b.studentNotes}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {b.meetingLink && (
                      <a
                        href={b.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-teal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-teal-dark"
                      >
                        <Video className="h-3.5 w-3.5" /> Join
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="divide-y">
            {past.length === 0 ? (
              <div className="px-5 py-8 text-center text-muted-foreground">No past sessions.</div>
            ) : (
              past.map((b) => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {(b.student.name ?? b.student.email).split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{b.student.name ?? b.student.email}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[b.status] ?? "bg-gray-100"}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateLocal(new Date(b.scheduledAt), tz)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeLocal(new Date(b.scheduledAt), tz)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/instructor/evaluations"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Evaluate
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
