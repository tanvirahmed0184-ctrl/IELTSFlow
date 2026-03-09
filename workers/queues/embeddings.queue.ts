// BullMQ queue for embedding generation jobs

export const EMBEDDINGS_QUEUE = "embeddings";

export interface EmbeddingJob {
  resourceId: string;
  content: string;
  metadata: Record<string, unknown>;
}
