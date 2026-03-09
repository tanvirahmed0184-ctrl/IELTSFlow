// pgvector integration via Supabase
// TODO: Implement vector database operations

export async function searchSimilar(embedding: number[], limit: number = 5) {
  // TODO: Query pgvector for similar embeddings
  return [];
}

export async function storeEmbedding(id: string, embedding: number[], metadata: Record<string, unknown>) {
  // TODO: Store embedding in pgvector
}
