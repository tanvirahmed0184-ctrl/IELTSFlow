import { getGeminiClient, GEMINI_EMBEDDING_MODEL } from "./gemini";

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getGeminiClient();
  const result = await client.models.embedContent({
    model: GEMINI_EMBEDDING_MODEL,
    contents: text,
  });
  return result.embeddings?.[0]?.values ?? [];
}

export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  // Gemini embedding API processes one at a time; batch sequentially
  for (const text of texts) {
    results.push(await generateEmbedding(text));
  }
  return results;
}
