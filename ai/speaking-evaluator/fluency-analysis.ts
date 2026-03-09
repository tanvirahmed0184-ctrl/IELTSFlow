// Fluency and coherence analysis

export interface FluencyMetrics {
  wordsPerMinute: number;
  fillerWords: { word: string; count: number }[];
  pauseCount: number;
  averagePauseDuration: number;
  coherenceScore: number;
}

export function analyzeFluency(transcript: string, durationSeconds: number): FluencyMetrics {
  const words = transcript.split(/\s+/).filter(Boolean);
  const wordsPerMinute = (words.length / durationSeconds) * 60;

  const fillerPatterns = ["um", "uh", "like", "you know", "basically", "actually"];
  const fillerWords = fillerPatterns
    .map((filler) => ({
      word: filler,
      count: (transcript.toLowerCase().match(new RegExp(`\\b${filler}\\b`, "g")) || []).length,
    }))
    .filter((f) => f.count > 0);

  return {
    wordsPerMinute,
    fillerWords,
    pauseCount: 0,
    averagePauseDuration: 0,
    coherenceScore: 0,
  };
}
