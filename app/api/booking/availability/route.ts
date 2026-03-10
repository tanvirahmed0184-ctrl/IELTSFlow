import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/booking/availability
 * Returns current instructor's availability slots.
 */
export async function GET() {
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
    if (!dbUser || dbUser.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Instructor only" }, { status: 403 });
    }

    const slots = await prisma.instructorAvailability.findMany({
      where: { instructorId: dbUser.id, isActive: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(slots);
  } catch (e) {
    console.error("[api/booking/availability GET]", e);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

/**
 * POST /api/booking/availability
 * Replace instructor's availability with provided slots.
 * Body: { timezone: string; slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }> }
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
    if (!dbUser || dbUser.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Instructor only" }, { status: 403 });
    }

    const body = await request.json();
    const { timezone = "UTC", slots = [] } = body as {
      timezone?: string;
      slots?: Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
    };

    await prisma.instructorAvailability.updateMany({
      where: { instructorId: dbUser.id },
      data: { isActive: false },
    });

    for (const s of slots) {
      await prisma.instructorAvailability.create({
        data: {
          instructorId: dbUser.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          timezone,
          isRecurring: true,
          isActive: true,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/booking/availability POST]", e);
    return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
  }
}
