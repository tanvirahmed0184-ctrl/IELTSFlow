// BullMQ queue for AI evaluation jobs
// TODO: Configure with Upstash Redis

import type { WritingTaskType, SpeakingPartType } from "@/app/generated/prisma/client";

export const AI_EVALUATION_QUEUE = "ai-evaluation";

export interface WritingEvaluationJob {
  type: "writing";
  attemptId: string;
  taskType: WritingTaskType;
  promptText: string;
  response: string;
  wordCount: number;
}

export interface SpeakingEvaluationJob {
  type: "speaking";
  sessionId: string;
  transcripts: { part: SpeakingPartType; text: string }[];
  topic: string;
  totalDurationSecs: number;
}

export type EvaluationJob = WritingEvaluationJob | SpeakingEvaluationJob;
