// Background processor for speaking evaluation
import type { SpeakingEvaluationJob } from "../queues/ai-evaluation.queue";

export async function processSpeakingEvaluation(_job: SpeakingEvaluationJob): Promise<void> {
  // TODO: Process speaking evaluation job
  // 1. Fetch session from DB, verify status = SUBMITTED
  // 2. Update status to EVALUATING
  // 3. Run fluency analysis (filler words, pause detection)
  // 4. Call AI evaluator (ai/speaking-evaluator/scoring.ts)
  // 5. Parse and validate response
  // 6. Create SpeakingAiEvaluation record in DB
  // 7. Update SpeakingSession status to EVALUATED
  // 8. Create ProgressRecord for the student
  // 9. Send notification (EVALUATION_READY)
}
