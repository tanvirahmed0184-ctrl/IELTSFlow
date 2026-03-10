"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Video, CheckCircle2, User, Star } from "lucide-react";
import { formatDateLocal, formatTimeLocal } from "@/lib/datetime";

interface Instructor {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  hourlyRate?: string;
  currency?: string;
  yearsExperience?: number;
  totalSessions?: number;
  averageRating?: number | null;
  isVerified?: boolean;
}

interface Slot {
  date: string;
  time: string;
  iso: string;
}

export default function BookInstructorPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<{ meetingLink: string | null } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const tz = "UTC";

  useEffect(() => {
    fetch("/api/booking/instructors")
      .then((r) => r.json())
      .then((data) => setInstructors(Array.isArray(data) ? data : []))
      .catch(() => setInstructors([]))
      .finally(() => setLoading(false));
  }, []);

  const fetchSlots = useCallback((instructorId: string) => {
    setSelectedSlot(null);
    setSlots([]);
    fetch(`/api/booking/slots?instructorId=${instructorId}&timezone=${tz}&days=14`)
      .then((r) => r.json())
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]));
  }, []);

  const handleSelectInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    fetchSlots(instructor.id);
    setBooking(null);
  };

  const handleBook = async () => {
    if (!selectedInstructor || !selectedSlot || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructorId: selectedInstructor.id,
          scheduledAt: selectedSlot.iso,
          durationMins: 15,
          studentNotes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBooking({ meetingLink: data.meetingLink });
    } catch (e) {
      alert("Failed to book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">Loading instructors...</p>
      </div>
    );
  }

  if (booking?.meetingLink) {
    return (
      <div className="mx-auto max-w-lg space-y-6 rounded-xl border bg-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Booking Confirmed</h2>
        <p className="text-muted-foreground">
          {selectedInstructor?.name ?? selectedInstructor?.email} on{" "}
          {selectedSlot && formatDateLocal(new Date(selectedSlot.iso), tz)} at{" "}
          {selectedSlot && formatTimeLocal(new Date(selectedSlot.iso), tz)}
        </p>
        <a
          href={booking.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 font-semibold text-white hover:bg-brand-teal-dark"
        >
          <Video className="h-5 w-5" /> Join Meeting
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Book a Speaking Session</h1>
        <p className="mt-1 text-muted-foreground">
          Choose an instructor and available time slot for a live speaking session.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <h3 className="mb-3 font-semibold">Instructors</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {instructors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No instructors available.</p>
            ) : (
              instructors.map((i) => (
                <button
                  key={i.id}
                  onClick={() => handleSelectInstructor(i)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedInstructor?.id === i.id
                      ? "border-brand-purple bg-brand-purple/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white">
                      {(i.name ?? i.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium">{i.name ?? i.email}</span>
                      {i.averageRating != null && (
                        <span className="ml-2 flex items-center gap-0.5 text-xs text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {i.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  {i.bio && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{i.bio}</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <h3 className="mb-3 font-semibold">Available Slots</h3>
          {!selectedInstructor ? (
            <p className="text-sm text-muted-foreground">Select an instructor first.</p>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                {slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No slots in the next 14 days.</p>
                ) : (
                  slots.map((s) => (
                    <button
                      key={s.iso}
                      onClick={() => setSelectedSlot(s)}
                      className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
                        selectedSlot?.iso === s.iso
                          ? "border-brand-teal bg-brand-teal/10 text-brand-teal"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {s.date} {s.time}
                    </button>
                  ))
                )}
              </div>
              {selectedSlot && (
                <>
                  <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mb-3 w-full rounded-lg border px-3 py-2 text-sm"
                    rows={2}
                  />
                  <button
                    onClick={handleBook}
                    disabled={submitting}
                    className="w-full rounded-xl bg-brand-teal px-4 py-3 font-semibold text-white hover:bg-brand-teal-dark disabled:opacity-50"
                  >
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
