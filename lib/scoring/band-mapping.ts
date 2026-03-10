// IELTS band score mapping utilities
// Based on publicly available IELTS band score conversion tables

import type { TestVariant } from "@/app/generated/prisma/client";

export const BAND_SCORES = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9] as const;

export type BandScore = (typeof BAND_SCORES)[number];

const LISTENING_MAP: [number, BandScore][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7],
  [27, 6.5], [23, 6], [20, 5.5], [16, 5],
  [13, 4.5], [10, 4], [6, 3.5], [4, 3],
];

const READING_ACADEMIC_MAP: [number, BandScore][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7],
  [27, 6.5], [23, 6], [19, 5.5], [15, 5],
  [13, 4.5], [10, 4], [6, 3.5], [4, 3],
];

const READING_GENERAL_MAP: [number, BandScore][] = [
  [40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7],
  [32, 6.5], [30, 6], [27, 5.5], [23, 5],
  [19, 4.5], [15, 4], [12, 3.5], [8, 3],
];

function mapScore(correct: number, table: [number, BandScore][]): BandScore {
  for (const [threshold, band] of table) {
    if (correct >= threshold) return band;
  }
  return 2.5;
}

export function rawToListeningBand(correctAnswers: number): BandScore {
  return mapScore(Math.min(40, Math.max(0, correctAnswers)), LISTENING_MAP);
}

export function rawToReadingBand(correctAnswers: number, variant: TestVariant = "ACADEMIC"): BandScore {
  const table = variant === "ACADEMIC" ? READING_ACADEMIC_MAP : READING_GENERAL_MAP;
  return mapScore(Math.min(40, Math.max(0, correctAnswers)), table);
}

export function calculateOverallBand(scores: number[]): BandScore {
  if (scores.length === 0) return 0;
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const rounded = Math.round(average * 2) / 2;
  return Math.min(9, Math.max(0, rounded)) as BandScore;
}

export function calculateMockTestOverall(bands: {
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
}): BandScore | null {
  const scores = Object.values(bands).filter((s): s is number => s != null);
  if (scores.length !== 4) return null;
  return calculateOverallBand(scores);
}
