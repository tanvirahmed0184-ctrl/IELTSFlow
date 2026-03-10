import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      include: { profile: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { targetBand, examDate, examVariant, timezone } = body as {
      targetBand?: number;
      examDate?: string;
      examVariant?: "ACADEMIC" | "GENERAL";
      timezone?: string;
    };

    const updates: Record<string, unknown> = {};
    if (typeof targetBand === "number" && targetBand >= 0 && targetBand <= 9) {
      updates.targetBand = targetBand;
    }
    if (typeof examDate === "string" && examDate) {
      updates.examDate = new Date(examDate);
    }
    if (examVariant === "ACADEMIC" || examVariant === "GENERAL") {
      updates.examVariant = examVariant;
    }
    if (typeof timezone === "string" && timezone) {
      updates.timezone = timezone;
    }

    if (!dbUser.profile) {
      await prisma.userProfile.create({
        data: { userId: dbUser.id, ...updates },
      });
    } else {
      await prisma.userProfile.update({
        where: { userId: dbUser.id },
        data: updates,
      });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: dbUser.id },
    });

    return NextResponse.json({ profile });
  } catch (e) {
    console.error("[user/profile PATCH]", e);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      include: { profile: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { onboardingCompleted } = body as { onboardingCompleted?: boolean };

    if (onboardingCompleted !== true) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!dbUser.profile) {
      await prisma.userProfile.create({
        data: {
          userId: dbUser.id,
          onboardingCompleted: true,
        },
      });
    } else {
      await prisma.userProfile.update({
        where: { userId: dbUser.id },
        data: { onboardingCompleted: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[user/profile POST]", e);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
