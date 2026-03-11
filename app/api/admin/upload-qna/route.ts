import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { getGeminiClient } from "@/lib/gemini";
import type {
  QuestionType,
  TestModule,
  TestVariant,
  Difficulty,
} from "@/app/generated/prisma/enums";

/**
 * Admin upload Q&A - uses Gemini to parse document and extract questions.
 * For subjective (Writing/Speaking): saves only prompt/cue card.
 */

const PARSER_PROMPT = `Extract all questions, options (if any), and correct answers from the following document.
Map each question strictly to one of these Prisma QuestionType enum values:
MULTIPLE_CHOICE, MULTIPLE_SELECT, FILL_IN_BLANK, TRUE_FALSE_NOT_GIVEN, YES_NO_NOT_GIVEN, MATCHING_HEADINGS, 
MATCHING_INFORMATION, MATCHING_FEATURES, SENTENCE_COMPLETION, SUMMARY_COMPLETION, SHORT_ANSWER.

Return ONLY valid JSON array. No markdown, no explanation.
Format: [{"questionText": "...", "options": ["A", "B", "C"] or null, "correctAnswer": "..." or ["A","B"], "type": "MULTIPLE_CHOICE"}]

For Writing/Speaking prompts (subjective), return: [{"type": "WRITING_PROMPT", "promptText": "...", "taskType": "TASK_1_ACADEMIC"|"TASK_1_GENERAL"|"TASK_2"}] or [{"type": "CUE_CARD", "promptText": "...", "topic": "..."}]

Document content:
`;

export async function POST(request: NextRequest) {
  try {
    console.log("[admin/upload-qna] request received");
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });
    console.log("[admin/upload-qna] db user", { id: dbUser?.id, role: dbUser?.role });
    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    console.log("[admin/upload-qna] reading formData");
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    console.log("[admin/upload-qna] file field", { hasFile: Boolean(file) });
    const text = formData.get("text") as string | null;
    const module = formData.get("module") as string | null;
    const variantParam = formData.get("variant") as string | null;
    const titleParam = formData.get("title") as string | null;

    let content = text?.trim() ?? "";
    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      content = Buffer.from(buffer).toString("utf-8");
    }
    console.log("[admin/upload-qna] content prepared", { length: content.length });

    if (!content || content.length < 20) {
      return NextResponse.json(
        { error: "Provide 'text' or upload a file with document content" },
        { status: 400 }
      );
    }

    console.log("[admin/upload-qna] calling Gemini parser");
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PARSER_PROMPT + content.slice(0, 50000),
      config: { temperature: 0.2, maxOutputTokens: 8192 },
    });

    console.log("[admin/upload-qna] Gemini response received");
    const rawText = response.text ?? "[]";
    const cleaned = rawText
      .replace(/```json\n?|\n?```/g, "")
      .trim();
    let parsed: unknown[];
    try {
      console.log("[admin/upload-qna] parsing Gemini JSON");
      parsed = JSON.parse(cleaned) as unknown[];
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: rawText.slice(0, 500) },
        { status: 500 }
      );
    }

    console.log("[admin/upload-qna] Gemini JSON parsed");

    const questions: Array<{
      questionText: string;
      options?: string[] | null;
      correctAnswer: string | string[];
      type: string;
    }> = [];
    const prompts: Array<{ promptText: string; taskType?: string; topic?: string }> = [];

    const validQuestionTypes: QuestionType[] = [
      "MULTIPLE_CHOICE",
      "MULTIPLE_SELECT",
      "FILL_IN_BLANK",
      "TRUE_FALSE_NOT_GIVEN",
      "YES_NO_NOT_GIVEN",
      "MATCHING_HEADINGS",
      "MATCHING_INFORMATION",
      "MATCHING_FEATURES",
      "SENTENCE_COMPLETION",
      "SUMMARY_COMPLETION",
      "SHORT_ANSWER",
    ];

    const toQuestionType = (t: string): QuestionType => {
      const upper = t.toUpperCase();
      return (validQuestionTypes.find((q) => q === upper) ??
        "MULTIPLE_CHOICE") as QuestionType;
    };

    for (const item of parsed as Record<string, unknown>[]) {
      const t = String(item.type ?? "").toUpperCase();
      if (t === "WRITING_PROMPT" || t === "CUE_CARD") {
        prompts.push({
          promptText: String(item.promptText ?? ""),
          taskType: item.taskType as string | undefined,
          topic: item.topic as string | undefined,
        });
      } else if (item.questionText && item.type) {
        questions.push({
          questionText: String(item.questionText),
          options: Array.isArray(item.options) ? item.options.map(String) : null,
          correctAnswer: Array.isArray(item.correctAnswer)
            ? item.correctAnswer.map(String)
            : String(item.correctAnswer ?? ""),
          type: t,
        });
      }
    }

    // Persist questions into Test / Question tables for LISTENING / READING modules
    let createdTestId: string | null = null;
    const moduleRaw = (module ?? "READING").toUpperCase();
      const testModule: TestModule =
        moduleRaw === "LISTENING"
          ? "LISTENING"
          : moduleRaw === "WRITING"
            ? "WRITING"
            : "READING";

      const variantRaw = (variantParam ?? "ACADEMIC").toUpperCase();
      const variant: TestVariant =
        variantRaw === "GENERAL" ? "GENERAL" : "ACADEMIC";

      const difficulty: Difficulty = "MEDIUM";

      console.log("[admin/upload-qna] persisting to DB", {
        testModule,
        variant,
        difficulty,
        questions: questions.length,
      });

      if (
        questions.length > 0 &&
        (testModule === "LISTENING" || testModule === "READING")
      ) {
        const title =
          titleParam?.trim() ||
          `${testModule === "LISTENING" ? "Listening" : "Reading"} Set • ${
            new Date().toISOString().split("T")[0]
          }`;

        const test = await prisma.test.create({
          data: {
            title,
            description: content.slice(0, 200),
            module: testModule,
            variant,
            difficulty,
            durationMins: testModule === "LISTENING" ? 30 : 60,
            totalQuestions: questions.length,
            isPractice: true,
            isActive: true,
            isGenerated: false,
          },
        });

        const section = await prisma.testSection.create({
          data: {
            testId: test.id,
            title:
              testModule === "LISTENING"
                ? "Listening Section"
                : "Reading Passage",
            order: 1,
          },
        });

        await prisma.$transaction(
          questions.map((q, index) =>
            prisma.question.create({
              data: {
                sectionId: section.id,
                type: toQuestionType(q.type),
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

        createdTestId = test.id;
        console.log("[admin/upload-qna] DB save complete", { testId: createdTestId });
      }

    return NextResponse.json({
      parsed: {
        questions: questions.length,
        prompts: prompts.length,
      },
      questions,
      prompts,
      testId: createdTestId,
    });
  } catch (e) {
    console.error("[admin/upload-qna] error", e);
    const message = e instanceof Error ? e.message : "Upload/parse failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
