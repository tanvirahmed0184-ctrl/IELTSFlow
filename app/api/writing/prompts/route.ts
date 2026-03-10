import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const variant = searchParams.get("variant") as "ACADEMIC" | "GENERAL" | null;
    const taskType = searchParams.get("taskType") ?? "";

    const prisma = getPrisma();

    const prompts = await prisma.writingPrompt.findMany({
      where: {
        isActive: true,
        ...(variant ? { variant } : {}),
        ...(taskType ? { taskType: taskType as "TASK_1_ACADEMIC" | "TASK_1_GENERAL" | "TASK_2" } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { promptText: { contains: search, mode: "insensitive" } },
                { topic: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        _count: { select: { attempts: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      prompts.map((p) => ({
        id: p.id,
        title: p.title,
        taskType: p.taskType,
        variant: p.variant,
        difficulty: p.difficulty,
        topic: p.topic,
        attemptCount: p._count.attempts,
      }))
    );
  } catch (e) {
    console.error("[api/writing/prompts GET]", e);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}
