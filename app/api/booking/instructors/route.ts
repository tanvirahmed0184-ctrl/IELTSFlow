import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

/**
 * GET /api/booking/instructors
 * Returns list of instructors with profiles for booking.
 */
export async function GET() {
  try {
    const prisma = getPrisma();
    const instructors = await prisma.user.findMany({
      where: { role: "INSTRUCTOR", isActive: true },
      include: {
        instructorProfile: true,
      },
    });

    const list = instructors.map((u) => ({
      id: u.id,
      name: u.name ?? u.email,
      email: u.email,
      bio: u.instructorProfile?.bio,
      hourlyRate: u.instructorProfile?.hourlyRate?.toString(),
      currency: u.instructorProfile?.currency ?? "USD",
      yearsExperience: u.instructorProfile?.yearsExperience,
      totalSessions: u.instructorProfile?.totalSessions,
      averageRating: u.instructorProfile?.averageRating,
      isVerified: u.instructorProfile?.isVerified,
    }));

    return NextResponse.json(list);
  } catch (e) {
    console.error("[api/booking/instructors]", e);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}
