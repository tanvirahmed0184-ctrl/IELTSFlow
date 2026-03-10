// Build prompts for AI test generation
import type { TestModule, TestVariant, Difficulty } from "@/app/generated/prisma/client";

export function buildTestGenerationPrompt(options: {
  module: TestModule;
  variant: TestVariant;
  difficulty: Difficulty;
  context: string[];
  questionCount?: number;
}): string {
  const { module, variant, difficulty, context, questionCount } = options;
  const count = questionCount ?? (module === "READING" || module === "LISTENING" ? 40 : 10);

  const contextBlock = context.length > 0
    ? `\n\nUse the following reference materials as inspiration for style, topic, and difficulty. Do NOT copy content directly:\n\n${context.join("\n---\n")}`
    : "";

  return [
    `Generate an original IELTS ${variant} ${module} test.`,
    `Difficulty: ${difficulty}`,
    `Total questions: ${count}`,
    "",
    "Requirements:",
    "- Content must be original and not copied from any source",
    "- Follow official IELTS format and question type conventions",
    "- Include correct answers and brief explanations",
    "- Return structured JSON matching the Test → TestSection → Question schema",
    contextBlock,
  ].join("\n");
}
