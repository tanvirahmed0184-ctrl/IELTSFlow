// RAG query for test generation context
import type { TestModule, Difficulty, TestVariant } from "@/lib/generated/prisma/client";
import { queryRAG } from "@/lib/rag";

export async function getTestGenerationContext(options: {
  module: TestModule;
  variant?: TestVariant;
  difficulty?: Difficulty;
  topic?: string;
  limit?: number;
}): Promise<string[]> {
  const { module, topic, limit } = options;
  const query = `IELTS ${module} test material${topic ? ` about ${topic}` : ""}`;

  const results = await queryRAG(query, {
    module: module.toLowerCase(),
    topic,
    limit: limit ?? 10,
  });

  return results as string[];
}
