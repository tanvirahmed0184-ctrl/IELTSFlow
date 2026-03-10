/**
 * Enrich transcript with [pause] tags and low-confidence word preservation
 * for IELTS Speaking evaluation (Fluency & Pronunciation tricks).
 */

export interface WordSegment {
  word: string;
  start: number;
  end: number;
  confidence?: number;
}

const FILLER_WORDS = ["um", "uh", "ah", "er", "umm", "uhh", "like", "you know"];
const PAUSE_THRESHOLD_SEC = 2;

export function enrichTranscript(
  words: WordSegment[],
  options?: { pauseThresholdSec?: number }
): string {
  const threshold = options?.pauseThresholdSec ?? PAUSE_THRESHOLD_SEC;
  const parts: string[] = [];
  let lastEnd = 0;

  for (const w of words) {
    const gap = w.start - lastEnd;
    if (gap >= threshold && lastEnd > 0) {
      const sec = Math.round(gap);
      parts.push(`[pause: ${sec} second${sec !== 1 ? "s" : ""}]`);
    }
    parts.push(w.word);
    lastEnd = w.end;
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function isFillerWord(word: string): boolean {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  return FILLER_WORDS.some((f) => cleaned === f || cleaned.startsWith(f));
}

/**
 * Apply confidence trick: keep low-confidence words as-is (pronunciation errors).
 * Groq Whisper doesn't return per-word confidence; we keep all words.
 * If segment avg_logprob is used later, low-confidence segments can be passed through.
 */
export function applyConfidenceTrick(
  words: WordSegment[],
  _segmentLogprobs?: number[]
): WordSegment[] {
  return words;
}
