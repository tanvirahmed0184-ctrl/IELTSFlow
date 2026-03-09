// RAG query for test generation context
import { queryRAG } from "@/lib/rag";

export async function getTestGenerationContext(module: string, topic?: string): Promise<string[]> {
  const results = await queryRAG(`IELTS ${module} test material ${topic ?? ""}`, {
    module,
    topic,
    limit: 10,
  });
  return results as string[];
}
