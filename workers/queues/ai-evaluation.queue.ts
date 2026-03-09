// BullMQ queue for AI evaluation jobs
// TODO: Configure with Upstash Redis

export const AI_EVALUATION_QUEUE = "ai-evaluation";

export interface WritingEvaluationJob {
  type: "writing";
  attemptId: string;
  taskType: "task1" | "task2";
  prompt: string;
  response: string;
}

export interface SpeakingEvaluationJob {
  type: "speaking";
  attemptId: string;
  transcript: string;
  part: 1 | 2 | 3;
  topic: string;
}

export type EvaluationJob = WritingEvaluationJob | SpeakingEvaluationJob;
