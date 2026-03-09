"use client";

import { useState, useCallback } from "react";
import { Clock, Plus, Trash2, Save, CheckCircle2, Calendar, Globe } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const min = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${min}`;
});

interface Slot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

const INITIAL_SLOTS: Slot[] = [
  { id: "1", day: 0, startTime: "09:00", endTime: "12:00", isRecurring: true },
  { id: "2", day: 0, startTime: "14:00", endTime: "17:00", isRecurring: true },
  { id: "3", day: 2, startTime: "10:00", endTime: "13:00", isRecurring: true },
  { id: "4", day: 4, startTime: "09:00", endTime: "11:00", isRecurring: true },
  { id: "5", day: 5, startTime: "10:00", endTime: "15:00", isRecurring: true },
];

export default function InstructorAvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [isSaved, setIsSaved] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("10:00");

  const slotsForDay = useCallback((day: number) => slots.filter((s) => s.day === day), [slots]);

  const addSlot = useCallback(() => {
    if (editingDay === null) return;
    if (newStart >= newEnd) return;
    setSlots((prev) => [
      ...prev,
      { id: Date.now().toString(), day: editingDay, startTime: newStart, endTime: newEnd, isRecurring: true },
    ]);
    setEditingDay(null);
    setIsSaved(false);
  }, [editingDay, newStart, newEnd]);

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    setIsSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: POST to /api/booking/availability
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }, []);

  const totalHours = slots.reduce((sum, s) => {
    const [sh, sm] = s.startTime.split(":").map(Number);
    const [eh, em] = s.endTime.split(":").map(Number);
    return sum + (eh + em / 60) - (sh + sm / 60);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Availability</h1>
          <p className="text-muted-foreground mt-1">Set your weekly schedule for speaking sessions.</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-purple-dark"
        >
          {isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaved ? "Saved!" : "Save Schedule"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Hours</div>
          <div className="mt-1 text-2xl font-extrabold">{totalHours.toFixed(1)}h</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Days</div>
          <div className="mt-1 text-2xl font-extrabold">{new Set(slots.map((s) => s.day)).size}/7</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
          <Globe className="h-5 w-5 text-brand-purple shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Timezone</div>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none"
            >
              {["UTC", "America/New_York", "Europe/London", "Asia/Dubai", "Asia/Dhaka", "Asia/Singapore", "Australia/Sydney"].map((tz) => (
                <option key={tz} value={tz}>{tz.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Weekly schedule */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="border-b px-5 py-4">
          <h3 className="text-sm font-semibold">Weekly Schedule</h3>
        </div>
        <div className="divide-y">
          {DAYS.map((day, dayIndex) => {
            const daySlots = slotsForDay(dayIndex);
            const isEditing = editingDay === dayIndex;
            return (
              <div key={day} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{day}</span>
                    {daySlots.length === 0 && (
                      <span className="text-xs text-muted-foreground">— No slots</span>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingDay(isEditing ? null : dayIndex)}
                    className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Slot
                  </button>
                </div>

                {/* Existing slots */}
                {daySlots.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="inline-flex items-center gap-2 rounded-lg bg-brand-purple/10 px-3 py-1.5">
                        <Clock className="h-3.5 w-3.5 text-brand-purple" />
                        <span className="text-xs font-medium">{slot.startTime} — {slot.endTime}</span>
                        <button
                          onClick={() => removeSlot(slot.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add slot form */}
                {isEditing && (
                  <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-muted/50 border">
                    <select value={newStart} onChange={(e) => setNewStart(e.target.value)} className="rounded-md border bg-background px-2 py-1.5 text-xs">
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="text-xs text-muted-foreground">to</span>
                    <select value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="rounded-md border bg-background px-2 py-1.5 text-xs">
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button
                      onClick={addSlot}
                      disabled={newStart >= newEnd}
                      className="inline-flex items-center gap-1 rounded-md bg-brand-teal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-teal-dark disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                    <button
                      onClick={() => setEditingDay(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
