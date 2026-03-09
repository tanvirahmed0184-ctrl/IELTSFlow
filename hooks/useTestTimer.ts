"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTestTimerOptions {
  initialSeconds: number;
  onTimeUp?: () => void;
  warningThresholdSecs?: number;
  dangerThresholdSecs?: number;
  autoStart?: boolean;
}

export type TimerStatus = "idle" | "running" | "paused" | "finished";
export type TimerUrgency = "normal" | "warning" | "danger";

export function useTestTimer({
  initialSeconds,
  onTimeUp,
  warningThresholdSecs = 300,
  dangerThresholdSecs = 60,
  autoStart = false,
}: UseTestTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>(autoStart ? "running" : "idle");
  const onTimeUpRef = useRef(onTimeUp);
  const hasCalledTimeUp = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (status !== "running" || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setStatus("finished");
          if (!hasCalledTimeUp.current) {
            hasCalledTimeUp.current = true;
            onTimeUpRef.current?.();
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, secondsLeft]);

  const start = useCallback(() => {
    hasCalledTimeUp.current = false;
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    if (status === "running") setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status === "paused") setStatus("running");
  }, [status]);

  const reset = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setStatus("idle");
    hasCalledTimeUp.current = false;
  }, [initialSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const elapsed = initialSeconds - secondsLeft;
  const progress = initialSeconds > 0 ? elapsed / initialSeconds : 0;

  let urgency: TimerUrgency = "normal";
  if (secondsLeft <= dangerThresholdSecs && secondsLeft > 0) urgency = "danger";
  else if (secondsLeft <= warningThresholdSecs && secondsLeft > 0) urgency = "warning";

  return {
    secondsLeft,
    elapsed,
    progress,
    status,
    urgency,
    formatted,
    isRunning: status === "running",
    isTimeUp: status === "finished",
    start,
    pause,
    resume,
    reset,
  };
}
