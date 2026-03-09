// Google Gemini text embeddings
// TODO: Configure Gemini API for embedding generation

export async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Call Gemini API to generate text embedding
  return [];
}

export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  // TODO: Batch embedding generation
  return texts.map(() => []);
}
