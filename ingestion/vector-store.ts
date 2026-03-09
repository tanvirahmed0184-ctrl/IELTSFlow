// Store embeddings in pgvector via Supabase
import { storeEmbedding } from "@/lib/vector-db";

export async function storeChunkEmbeddings(
  chunks: { chunk: { content: string; metadata: Record<string, unknown> }; embedding: number[] }[],
  resourceId: string
): Promise<void> {
  for (const { chunk, embedding } of chunks) {
    await storeEmbedding(
      `${resourceId}-${chunk.metadata.position}`,
      embedding,
      { ...chunk.metadata, resourceId, content: chunk.content }
    );
  }
}
