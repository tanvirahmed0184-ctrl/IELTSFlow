import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { generatePracticeTest } from "@/lib/ai/practice-generator";
import type { TestModule } from "@/app/generated/prisma/enums";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
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
    const {
      testId,
      mode,
      module,
    } = body as {
      testId?: string;
      mode?: "practice" | "simulation";
      module?: TestModule;
    };

    if (mode === "practice") {
      // Mode A: Dynamic practice test using RAG + Gemini
      if (!module) {
        return NextResponse.json(
          { error: "module is required for practice mode" },
          { status: 400 }
        );
      }

      try {
        const questions = await generatePracticeTest({
          module,
          totalQuestions: 20,
          questionBreakdown: [
            { type: "MULTIPLE_CHOICE", count: 15 },
            { type: "SHORT_ANSWER", count: 5 },
          ],
        });

        if (questions.length === 0) {
          return NextResponse.json(
            { error: "Could not generate practice test. Add more resources first." },
            { status: 500 }
          );
        }

        const test = await prisma.test.create({
          data: {
            title: `${module} Practice Set`,
            description: "AI-generated practice test based on your uploaded resources.",
            module,
            variant: "ACADEMIC",
            difficulty: "MEDIUM",
            durationMins: module === "LISTENING" ? 30 : 60,
            totalQuestions: questions.length,
            isPractice: true,
            isActive: true,
            isGenerated: true,
          },
        });

        const section = await prisma.testSection.create({
          data: {
            testId: test.id,
            title: module === "LISTENING" ? "Listening Practice" : "Reading Practice",
            order: 1,
          },
        });

        await prisma.$transaction(
          questions.map((q, index) =>
            prisma.question.create({
              data: {
                sectionId: section.id,
                type: q.type,
                questionText: q.questionText,
                questionContext: null,
                options: q.options ?? undefined,
                correctAnswer: q.correctAnswer as unknown as object,
                points: 1,
                order: index + 1,
              },
            })
          )
        );

        const attempt = await prisma.testAttempt.create({
          data: {
            userId: dbUser.id,
            testId: test.id,
          },
        });

        return NextResponse.json({
          attemptId: attempt.id,
          testId: test.id,
          module: test.module,
        });
      } catch (err) {
        console.error("[api/tests/attempt POST] practice mode failed", err);
        return NextResponse.json(
          { error: "Failed to generate practice test" },
          { status: 500 }
        );
      }
    }

    // Mode B / default: strict static exam (pre-uploaded Test)
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
    return NextResponse.json(
      { error: "Failed to create attempt" },
      { status: 500 }
    );
  }
}
