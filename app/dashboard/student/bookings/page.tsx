"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Video } from "lucide-react";
import { formatDateLocal, formatTimeLocal } from "@/lib/datetime";

const tz = "UTC";

interface Booking {
  id: string;
  scheduledAt: string;
  durationMins: number;
  status: string;
  meetingLink: string | null;
  instructor: { id: string; name: string | null; email: string };
}

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/booking")
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => new Date(b.scheduledAt) >= now && !["CANCELLED_BY_STUDENT", "CANCELLED_BY_INSTRUCTOR"].includes(b.status)
  );
  const past = bookings.filter(
    (b) => new Date(b.scheduledAt) < now || ["CANCELLED_BY_STUDENT", "CANCELLED_BY_INSTRUCTOR"].includes(b.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-1 text-muted-foreground">View and join your scheduled speaking sessions.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="border-b px-5 py-3">
                <h3 className="font-semibold">Upcoming</h3>
              </div>
              <div className="divide-y">
                {upcoming.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white">
                        {(b.instructor.name ?? b.instructor.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{b.instructor.name ?? b.instructor.email}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateLocal(new Date(b.scheduledAt), tz)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTimeLocal(new Date(b.scheduledAt), tz)} ({b.durationMins} min)
                          </span>
                        </div>
                      </div>
                    </div>
                    {b.meetingLink && (
                      <a
                        href={b.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-4 py-2.5 font-semibold text-white hover:bg-brand-teal-dark"
                      >
                        <Video className="h-4 w-4" /> Join Meeting
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcoming.length === 0 && past.length === 0 && (
            <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
              No bookings yet.{" "}
              <a href="/dashboard/student/book" className="text-brand-teal hover:underline">
                Book an instructor
              </a>
              .
            </p>
          )}

          {past.length > 0 && (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="border-b px-5 py-3">
                <h3 className="font-semibold text-muted-foreground">Past</h3>
              </div>
              <div className="divide-y">
                {past.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {(b.instructor.name ?? b.instructor.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{b.instructor.name ?? b.instructor.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateLocal(new Date(b.scheduledAt), tz)} · {formatTimeLocal(new Date(b.scheduledAt), tz)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
