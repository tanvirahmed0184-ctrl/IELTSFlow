import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";

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
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { testId, mode } = body as { testId: string; mode?: "practice" | "simulation" };

    if (!testId) {
      return NextResponse.json({ error: "testId required" }, { status: 400 });
    }

    const test = await prisma.test.findUnique({
      where: { id: testId, isActive: true },
    });
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const attempt = await prisma.testAttempt.create({
      data: {
        userId: dbUser.id,
        testId,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      testId: test.id,
      module: test.module,
    });
  } catch (e) {
    console.error("[api/tests/attempt POST]", e);
    return NextResponse.json({ error: "Failed to create attempt" }, { status: 500 });
  }
}
