import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateMeetingLink, MEET_PROVIDER } from "@/lib/meet";

/**
 * GET /api/booking
 * Returns current user's bookings (as student or instructor).
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const asInstructor = searchParams.get("as") === "instructor";

    const bookings = await prisma.booking.findMany({
      where: asInstructor ? { instructorId: dbUser.id } : { studentId: dbUser.id },
      include: {
        student: { select: { id: true, name: true, email: true } },
        instructor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { scheduledAt: "asc" },
      take: 50,
    });

    return NextResponse.json(bookings);
  } catch (e) {
    console.error("[api/booking GET]", e);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

/**
 * POST /api/booking
 * Create a booking (student books instructor).
 * Body: { instructorId: string; scheduledAt: string (ISO); durationMins?: number; studentNotes?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { instructorId, scheduledAt, durationMins = 15, studentNotes } = body as {
      instructorId: string;
      scheduledAt: string;
      durationMins?: number;
      studentNotes?: string;
    };

    if (!instructorId || !scheduledAt) {
      return NextResponse.json({ error: "instructorId and scheduledAt required" }, { status: 400 });
    }

    const scheduled = new Date(scheduledAt);
    if (scheduled <= new Date()) {
      return NextResponse.json({ error: "scheduledAt must be in the future" }, { status: 400 });
    }

    const instructor = await prisma.user.findFirst({
      where: { id: instructorId, role: "INSTRUCTOR" },
    });
    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: dbUser.id,
        instructorId,
        scheduledAt: scheduled,
        durationMins,
        status: "CONFIRMED",
        meetingLink: null,
        meetingProvider: null,
        studentNotes: studentNotes ?? null,
      },
    });

    const meetingLink = generateMeetingLink(booking.id);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { meetingLink, meetingProvider: MEET_PROVIDER },
    });

    const updated = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("[api/booking POST]", e);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
