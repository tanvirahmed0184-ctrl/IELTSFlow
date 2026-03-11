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
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { role, name } = body as { role?: string; name?: string };

    const prismaRole = role ? (ROLE_MAP[role] ?? "STUDENT") : undefined;

    const prisma = getPrisma();

    const user = await prisma.user.upsert({
      where: { supabaseId: authUser.id },
      create: {
        supabaseId: authUser.id,
        email: authUser.email ?? "",
        name: name ?? authUser.user_metadata?.name ?? null,
        ...(prismaRole ? { role: prismaRole } : {}),
        lastLoginAt: new Date(),
      },
      update: {
        email: authUser.email ?? "",
        ...(name ? { name } : {}),
        ...(prismaRole ? { role: prismaRole } : {}),
        lastLoginAt: new Date(),
      },
      include: { profile: true },
    });

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    return NextResponse.json({ user: { ...user, profile } }, { status: 200 });
  } catch (e) {
    console.error("[auth/ensure]", e);
    return NextResponse.json({ error: "Failed to ensure user" }, { status: 500 });
  }
}

