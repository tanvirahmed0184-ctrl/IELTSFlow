// Build prompts for AI test generation

export type TestModule = "listening" | "reading" | "writing" | "speaking";
export type TestVariant = "academic" | "general";
export type DifficultyLevel = "easy" | "medium" | "hard";

export function buildTestGenerationPrompt(options: {
  module: TestModule;
  variant: TestVariant;
  difficulty: DifficultyLevel;
  context: string[];
  questionCount?: number;
}): string {
  // TODO: Build detailed prompt for test generation
  return `Generate an IELTS ${options.variant} ${options.module} test with ${options.questionCount ?? 40} questions at ${options.difficulty} difficulty level.`;
}
