export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidBandScore(score: number): boolean {
  return score >= 0 && score <= 9 && score % 0.5 === 0;
}

export function validateWordCount(text: string, min: number, max?: number): { valid: boolean; count: number } {
  const count = text.trim().split(/\s+/).filter(Boolean).length;
  const valid = count >= min && (max === undefined || count <= max);
  return { valid, count };
}
