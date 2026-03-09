"use client";

import { useMemo } from "react";

export function useBandScore(scores: { listening?: number; reading?: number; writing?: number; speaking?: number }) {
  const overall = useMemo(() => {
    const validScores = Object.values(scores).filter((s): s is number => s !== undefined);
    if (validScores.length === 0) return 0;
    const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    return Math.round(avg * 2) / 2;
  }, [scores]);

  return {
    ...scores,
    overall,
  };
}
