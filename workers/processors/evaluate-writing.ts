// Background processor for writing evaluation
import type { WritingEvaluationJob } from "../queues/ai-evaluation.queue";

export async function processWritingEvaluation(_job: WritingEvaluationJob): Promise<void> {
  // TODO: Process writing evaluation job
  // 1. Fetch attempt from DB, verify status = SUBMITTED
  // 2. Update status to EVALUATING
  // 3. Call AI evaluator (ai/writing-evaluator/evaluator.ts)
  // 4. Parse and validate response
  // 5. Create WritingEvaluation record in DB
  // 6. Update WritingAttempt status to EVALUATED, set bandScore
  // 7. Create ProgressRecord for the student
  // 8. Send notification (EVALUATION_READY)
}
