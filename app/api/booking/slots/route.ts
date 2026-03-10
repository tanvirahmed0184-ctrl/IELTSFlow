import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import {
  addDays,
  startOfDay,
  setHours,
  setMinutes,
  format,
} from "date-fns";

/**
 * GET /api/booking/slots?instructorId=xxx&timezone=Asia/Dhaka&days=14
 * Returns available 15-min slots for the next N days.
 * Excludes already-booked slots.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get("instructorId");
    const tz = searchParams.get("timezone") ?? "UTC";
    const days = Math.min(28, Math.max(1, parseInt(searchParams.get("days") ?? "14", 10)));

    if (!instructorId) {
      return NextResponse.json({ error: "instructorId required" }, { status: 400 });
    }

    const prisma = getPrisma();
    const availability = await prisma.instructorAvailability.findMany({
      where: { instructorId, isActive: true, isRecurring: true },
    });

    const booked = await prisma.booking.findMany({
      where: {
        instructorId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: { gte: new Date() },
      },
      select: { scheduledAt: true, durationMins: true },
    });

    const bookedRanges = booked.map((b) => ({
      start: b.scheduledAt.getTime(),
      end: b.scheduledAt.getTime() + (b.durationMins ?? 15) * 60 * 1000,
    }));

    const today = startOfDay(new Date());
    const slots: Array<{ date: string; time: string; iso: string }> = [];

    for (let d = 0; d < days; d++) {
      const date = addDays(today, d);
      const dayOfWeek = (date.getDay() + 6) % 7; // Mon=0, Sun=6
      const dayAvail = availability.filter((a) => a.dayOfWeek === dayOfWeek);
      for (const av of dayAvail) {
        const [sh, sm] = av.startTime.split(":").map(Number);
        const [eh, em] = av.endTime.split(":").map(Number);
        let slotStart = setMinutes(setHours(date, sh), sm);
        const endTime = setMinutes(setHours(date, eh), em);
        while (slotStart < endTime) {
          if (slotStart > new Date()) {
            const iso = slotStart.toISOString();
            const slotEndMs = slotStart.getTime() + 15 * 60 * 1000;
            const isBooked = bookedRanges.some(
              (r) => (slotStart.getTime() >= r.start && slotStart.getTime() < r.end) ||
                (slotEndMs > r.start && slotEndMs <= r.end) ||
                (slotStart.getTime() <= r.start && slotEndMs >= r.end)
            );
            if (!isBooked) {
              slots.push({
                date: format(slotStart, "yyyy-MM-dd"),
                time: format(slotStart, "HH:mm"),
                iso,
              });
            }
          }
          slotStart = new Date(slotStart.getTime() + 15 * 60 * 1000);
        }
      }
    }

    return NextResponse.json(slots);
  } catch (e) {
    console.error("[api/booking/slots]", e);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
