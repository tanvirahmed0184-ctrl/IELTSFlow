/**
 * Deterministic grading for Listening/Reading (MCQ, exact-match).
 * Saves API calls for objective questions.
 */

export type GradingResult = {
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
};

/**
 * Normalize answer for comparison (trim, lowercase, remove extra spaces).
 */
function normalize(value: unknown): string {
  if (value == null) return "";
  const s = String(value).trim().toLowerCase().replace(/\s+/g, " ");
  return s;
}

/**
 * Check if user answer matches correct answer.
 * Supports: string, number, string array (for multiple select).
 */
export function gradeAnswer(
  userAnswer: unknown,
  correctAnswer: unknown,
  acceptedAnswers?: unknown[] | null,
  points = 1
): GradingResult {
  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  if (!user) {
    return { isCorrect: false, pointsEarned: 0, maxPoints: points };
  }

  if (user === correct) {
    return { isCorrect: true, pointsEarned: points, maxPoints: points };
  }

  if (acceptedAnswers && Array.isArray(acceptedAnswers)) {
    for (const acc of acceptedAnswers) {
      if (normalize(acc) === user) {
        return { isCorrect: true, pointsEarned: points, maxPoints: points };
      }
    }
  }

  return { isCorrect: false, pointsEarned: 0, maxPoints: points };
}

/**
 * Grade multiple answers and return aggregate.
 */
export function gradeAttempt(
  answers: Array<{ userAnswer: unknown; correctAnswer: unknown; acceptedAnswers?: unknown[] | null; points?: number }>
): { correctCount: number; totalPoints: number; maxPoints: number; results: GradingResult[] } {
  const results = answers.map((a) =>
    gradeAnswer(a.userAnswer, a.correctAnswer, a.acceptedAnswers, a.points ?? 1)
  );
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalPoints = results.reduce((sum, r) => sum + r.pointsEarned, 0);
  const maxPoints = results.reduce((sum, r) => sum + r.maxPoints, 0);
  return { correctCount, totalPoints, maxPoints, results };
}
