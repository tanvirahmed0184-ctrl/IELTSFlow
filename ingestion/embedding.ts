// Embedding generation for ingested content
import { generateEmbedding } from "@/lib/embeddings";
import type { TextChunk } from "./chunker";

export async function embedChunks(chunks: TextChunk[]): Promise<{ chunk: TextChunk; embedding: number[] }[]> {
  const results = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.content);
    results.push({ chunk, embedding });
  }
  return results;
}
