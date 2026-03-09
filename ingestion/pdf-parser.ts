import * as pdfParseModule from "pdf-parse";

type PdfParseFn = (buf: Buffer) => Promise<{ text: string; numpages: number }>;

export async function parsePDF(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const parse = (
    typeof pdfParseModule === "function"
      ? pdfParseModule
      : (pdfParseModule as unknown as { default: PdfParseFn }).default
  ) as PdfParseFn;

  const data = await parse(buffer);
  return { text: data.text, pages: data.numpages };
}
