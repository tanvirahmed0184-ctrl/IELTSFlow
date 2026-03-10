"use client";

import { useState, useRef, useCallback } from "react";
import { enrichTranscript } from "@/lib/speaking/transcript-enrichment";

export interface TranscriptionResult {
  rawText: string;
  enrichedTranscript: string;
  words: Array<{ word: string; start: number; end: number }>;
}

export function useSpeechRecorder(options?: {
  onTranscribed?: (result: TranscriptionResult) => void;
  useGroq?: boolean;
}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: mime });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Microphone access denied"
      );
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  const transcribe = useCallback(
    async (blob: Blob): Promise<TranscriptionResult | null> => {
      setIsTranscribing(true);
      setError(null);
      try {
        const formData = new FormData();
        const file = new File([blob], "recording.webm", { type: blob.type });
        formData.append("audio", file);

        const res = await fetch("/api/speaking/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Transcription failed");
        }

        const data = (await res.json()) as {
          text: string;
          words?: Array<{ word: string; start: number; end: number }>;
        };

        const words = data.words ?? [];
        const enrichedTranscript = words.length > 0
          ? enrichTranscript(words)
          : data.text ?? "";

        const result: TranscriptionResult = {
          rawText: data.text ?? "",
          enrichedTranscript: enrichedTranscript || (data.text ?? ""),
          words,
        };

        options?.onTranscribed?.(result);
        setAudioBlob(null);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Transcription failed");
        return null;
      } finally {
        setIsTranscribing(false);
      }
    },
    [options]
  );

  const stopAndTranscribe = useCallback(async (): Promise<TranscriptionResult | null> => {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state === "inactive") {
      if (audioBlob) return transcribe(audioBlob);
      return null;
    }

    return new Promise((resolve) => {
      const stream = streamRef.current;
      rec.onstop = async () => {
        stream?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, {
          type: rec.mimeType || "audio/webm",
        });
        const result = await transcribe(blob);
        resolve(result);
      };
      rec.stop();
    });
  }, [audioBlob, transcribe]);

  return {
    isRecording,
    isTranscribing,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    transcribe,
    stopAndTranscribe,
  };
}
