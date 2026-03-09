// BullMQ queue for audio transcription jobs

export const TRANSCRIPTION_QUEUE = "transcription";

export interface TranscriptionJob {
  attemptId: string;
  audioUrl: string;
  language?: string;
}
