// Text chunking for embedding generation

export interface TextChunk {
  content: string;
  metadata: {
    source: string;
    page?: number;
    position: number;
  };
}

export function chunkText(text: string, options?: { chunkSize?: number; overlap?: number }): TextChunk[] {
  const chunkSize = options?.chunkSize ?? 1000;
  const overlap = options?.overlap ?? 200;
  const chunks: TextChunk[] = [];

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push({
      content: text.slice(i, i + chunkSize),
      metadata: {
        source: "",
        position: i,
      },
    });
  }

  return chunks;
}
