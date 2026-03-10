import { NextRequest, NextResponse } from "next/server";
import { chunkText } from "@/ingestion/chunker";
import { generateEmbedding } from "@/lib/embeddings";
import { getPrisma } from "@/lib/prisma";

async function parsePDFBuffer(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const pdfParseModule = await import("pdf-parse");
  const parse =
    typeof pdfParseModule === "function"
      ? (pdfParseModule as (buf: Buffer) => Promise<{ text: string; numpages: number }>)
      : (pdfParseModule as unknown as { default: (buf: Buffer) => Promise<{ text: string; numpages: number }> }).default;
  const data = await parse(buffer);
  return { text: data.text, pages: data.numpages };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) ?? "Untitled";
    const moduleValue = formData.get("module") as string | null;
    const sourceType = (formData.get("sourceType") as string) ?? "GENERAL_MATERIAL";
    const topic = formData.get("topic") as string | null;
    const difficulty = formData.get("difficulty") as string | null;
    const variant = formData.get("variant") as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const fileType = fileName.endsWith(".pdf") ? "PDF" : fileName.endsWith(".txt") ? "TXT" : "PDF";

    // 1. Extract text (dynamic import so pdf-parse load errors are caught)
    let extractedText = "";
    if (fileType === "PDF") {
      const parsed = await parsePDFBuffer(buffer);
      extractedText = parsed.text;
    } else {
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ success: false, error: "No text could be extracted from the file" }, { status: 400 });
    }

    // 2. Chunk text
    const chunks = chunkText(extractedText, { chunkSize: 800, overlap: 150 });

    // 3. Generate embeddings for each chunk
    const embeddedChunks: { content: string; embedding: number[]; index: number }[] = [];
    for (let i = 0; i < chunks.length; i++) {
      try {
        const embedding = await generateEmbedding(chunks[i].content);
        embeddedChunks.push({ content: chunks[i].content, embedding, index: i });
      } catch {
        // If embedding fails (no API key), store chunk without embedding
        embeddedChunks.push({ content: chunks[i].content, embedding: [], index: i });
      }
    }

    // 4. Try to save to database
    let resourceId: string | null = null;
    try {
      const prisma = getPrisma();
      const resource = await prisma.resource.create({
        data: {
          uploadedById: "00000000-0000-0000-0000-000000000000", // placeholder until auth
          title,
          description: `Uploaded file: ${fileName}`,
          fileUrl: `/uploads/${fileName}`,
          fileName,
          fileSizeBytes: buffer.length,
          fileType: fileType as "PDF" | "TXT",
          sourceType: sourceType as "READING_PASSAGE" | "WRITING_PROMPT" | "GENERAL_MATERIAL",
          module: moduleValue as "LISTENING" | "READING" | "WRITING" | "SPEAKING" | null,
          topic,
          difficulty: difficulty as "EASY" | "MEDIUM" | "HARD" | null,
          variant: variant as "ACADEMIC" | "GENERAL" | null,
          extractedText: extractedText.slice(0, 50000),
          processingStatus: "COMPLETED",
          totalChunks: embeddedChunks.length,
        },
      });
      resourceId = resource.id;

      // Store chunks (without vector — raw SQL needed for pgvector insert)
      for (const chunk of embeddedChunks) {
        await prisma.resourceChunk.create({
          data: {
            resourceId: resource.id,
            content: chunk.content,
            chunkIndex: chunk.index,
            tokenCount: chunk.content.split(/\s+/).length,
            metadata: { embeddingDimensions: chunk.embedding.length },
          },
        });
      }
    } catch {
      console.warn("DB not connected — returning extraction results without persisting");
    }

    return NextResponse.json({
      success: true,
      resourceId,
      fileName,
      extractedTextLength: extractedText.length,
      totalChunks: embeddedChunks.length,
      chunksWithEmbeddings: embeddedChunks.filter((c) => c.embedding.length > 0).length,
      preview: extractedText.slice(0, 500),
    });
  } catch (error) {
    console.error("Resource upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
