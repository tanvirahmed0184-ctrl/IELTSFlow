import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import type { TestModule } from "@/app/generated/prisma/enums";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module") as TestModule | null;
    const search = searchParams.get("search") ?? "";
    const variant = searchParams.get("variant") as "ACADEMIC" | "GENERAL" | null;

    const prisma = getPrisma();

    if (!module || !["LISTENING", "READING"].includes(module)) {
      return NextResponse.json({ error: "Invalid module" }, { status: 400 });
    }

    const tests = await prisma.test.findMany({
      where: {
        module,
        isActive: true,
        ...(variant ? { variant } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        _count: { select: { testAttempts: true } },
      },
      orderBy: [
        { isPractice: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(
      tests.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        module: t.module,
        variant: t.variant,
        difficulty: t.difficulty,
        durationMins: t.durationMins,
        totalQuestions: t.totalQuestions,
        isPractice: t.isPractice,
        attemptCount: t._count.testAttempts,
      }))
    );
  } catch (e) {
    console.error("[api/tests GET]", e);
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}
