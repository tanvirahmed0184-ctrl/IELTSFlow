import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import type { UserRole as PrismaUserRole } from "@/app/generated/prisma/enums";

const ROLE_MAP: Record<string, PrismaUserRole> = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role = "STUDENT", name } = body as { role?: string; name?: string };

    const prisma = getPrisma();
    const existing = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      include: { profile: true },
    });

    if (existing) {
      return NextResponse.json({
        user: existing,
        isNew: false,
      });
    }

    const prismaRole = ROLE_MAP[role] ?? "STUDENT";
    const newUser = await prisma.user.create({
      data: {
        supabaseId: authUser.id,
        email: authUser.email ?? "",
        name: name ?? authUser.user_metadata?.name ?? null,
        role: prismaRole,
      },
      include: { profile: true },
    });

    await prisma.userProfile.create({
      data: {
        userId: newUser.id,
      },
    });

    const userWithProfile = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: { profile: true },
    });

    return NextResponse.json({
      user: userWithProfile,
      isNew: true,
    });
  } catch (e) {
    console.error("[auth/sync]", e);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
