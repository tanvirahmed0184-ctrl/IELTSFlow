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
    const { promptId, mode } = body as { promptId: string; mode?: "practice" | "simulation" };

    if (!promptId) {
      return NextResponse.json({ error: "promptId required" }, { status: 400 });
    }

    const prompt = await prisma.writingPrompt.findUnique({
      where: { id: promptId, isActive: true },
    });
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const attempt = await prisma.writingAttempt.create({
      data: {
        userId: dbUser.id,
        promptId,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      promptId: prompt.id,
      module: "WRITING",
    });
  } catch (e) {
    console.error("[api/writing/attempt POST]", e);
    return NextResponse.json({ error: "Failed to create attempt" }, { status: 500 });
  }
}
