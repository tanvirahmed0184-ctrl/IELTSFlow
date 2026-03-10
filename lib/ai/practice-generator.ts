/**
 * RAG-based practice test generator (Mode A).
 * Uses pgvector to retrieve context, Gemini to generate questions.
 */

import { getPrisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";
import { getGeminiClient } from "@/lib/gemini";
import type { TestModule, QuestionType } from "@/app/generated/prisma/enums";

export interface TestConfig {
  module: TestModule;
  totalQuestions: number;
  questionBreakdown: { type: QuestionType; count: number }[];
}

export interface GeneratedQuestion {
  questionText: string;
  options?: string[];
  correctAnswer: string | string[];
  type: QuestionType;
}

async function retrieveChunks(
  query: string,
  limit: number
): Promise<{ id: string; content: string }[]> {
  const prisma = getPrisma();
  const embedding = await generateEmbedding(query);
  const embeddingStr = `[${embedding.join(",")}]`;

  try {
    const rows = await prisma.$queryRawUnsafe<{ id: string; content: string }[]>(
      `SELECT id, content FROM resource_chunks 
       WHERE embedding IS NOT NULL 
       ORDER BY embedding <=> $1::vector 
       LIMIT $2`,
      embeddingStr,
      limit
    );
    return rows ?? [];
  } catch {
    const fallback = await prisma.resourceChunk.findMany({
      take: limit,
      select: { id: true, content: true },
    });
    return fallback;
  }
}

export async function generatePracticeTest(
  testConfig: TestConfig
): Promise<GeneratedQuestion[]> {
  const prisma = getPrisma();
  const query = `IELTS ${testConfig.module} practice questions`;
  const chunks = await retrieveChunks(query, 15);
  const context = chunks.map((c) => c.content).join("\n\n");

  const breakdownText = testConfig.questionBreakdown
    .map((b) => `- ${b.count} questions of type ${b.type}`)
    .join("\n");

  const systemPrompt = `You are an expert IELTS test creator. Using ONLY the provided context text, generate exactly ${testConfig.totalQuestions} questions.
Do NOT hallucinate. If the context is insufficient, use the closest relevant content.
Distribution MUST be:
${breakdownText}

Output ONLY valid JSON array:
[{"questionText": "...", "options": ["A", "B", ...] or null, "correctAnswer": "..." or ["...", "..."], "type": "MULTIPLE_CHOICE"|"FILL_IN_BLANK"|"TRUE_FALSE_NOT_GIVEN"|...}]

Use QuestionType enum values: MULTIPLE_CHOICE, FILL_IN_BLANK, TRUE_FALSE_NOT_GIVEN, SHORT_ANSWER, MATCHING_HEADINGS, etc.`;

  const userPrompt = `Context:\n${context || "No specific context available. Generate general IELTS-style questions."}`;

  const client = getGeminiClient();
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: fullPrompt,
    config: { temperature: 0.3, maxOutputTokens: 8192 },
  });

  const text = response.text ?? "[]";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  let parsed: unknown[];
  try {
    parsed = JSON.parse(cleaned) as unknown[];
  } catch {
    parsed = [];
  }

  const audit = await prisma.generationAudit.create({
    data: {
      generationType: "PRACTICE_TEST",
      status: "PENDING",
      inputPrompt: userPrompt,
      retrievedChunkIds: chunks.map((c) => c.id),
      rawAiOutput: text,
      parsedOutput: JSON.parse(JSON.stringify(parsed)),
      modelName: "gemini",
    },
  });

  const questions = (parsed as GeneratedQuestion[]).filter(
    (q) => q?.questionText && q?.type && q?.correctAnswer != null
  );

  await prisma.generationAudit.update({
    where: { id: audit.id },
    data: { status: questions.length > 0 ? "GENERATING" : "REJECTED" },
  });

  return questions;
}
