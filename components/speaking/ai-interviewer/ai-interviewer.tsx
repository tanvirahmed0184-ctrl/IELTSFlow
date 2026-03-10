"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useSpeechRecorder } from "@/hooks/useSpeechRecorder";
import { WaveVisualizer } from "@/components/speaking/WaveVisualizer";
import { speakText, stopSpeaking } from "@/lib/speaking/tts";
import { Button } from "@/components/ui/button";

type Phase = "idle" | "ai_speaking" | "listening" | "processing" | "complete";

interface Message {
  role: "examiner" | "user";
  text: string;
}

export function AIInterviewer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [evaluation, setEvaluation] = useState<Record<string, unknown> | null>(null);
  const [currentPart, setCurrentPart] = useState<"PART_1" | "PART_2" | "PART_3">("PART_1");
  const initRef = useRef(false);

  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const handleTranscribed = useCallback(
    async (result: { enrichedTranscript: string }) => {
      if (!result.enrichedTranscript.trim()) return;
      setPhase("processing");
      const newMessages = [...messagesRef.current, { role: "user" as const, text: result.enrichedTranscript }];
      setMessages(newMessages);

      try {
        const res = await fetch("/api/speaking/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((x) => ({ role: x.role, text: x.text })),
            transcript: result.enrichedTranscript,
            part: currentPart,
          }),
        });
        const data = await res.json();

        if (data.type === "evaluation") {
          setEvaluation(data.evaluation);
          setPhase("complete");
          return;
        }

        const nextText = data.text ?? "";
        setMessages((m) => [...m, { role: "examiner", text: nextText }]);
        setPhase("ai_speaking");
        speakText(nextText, {
          onEnd: () => setPhase("listening"),
          rate: 0.9,
        });
      } catch {
        setPhase("listening");
      }
    },
    [currentPart]
  );

  const {
    isRecording,
    isTranscribing,
    error,
    startRecording,
    stopAndTranscribe,
  } = useSpeechRecorder({ onTranscribed: handleTranscribed });

  const startSession = useCallback(() => {
    setPhase("processing");
    fetch("/api/speaking/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [], part: currentPart }),
    })
      .then((r) => r.json())
      .then((data) => {
        const text = data.text ?? "Hello. Let's begin the IELTS Speaking test. First, can you tell me your full name?";
        setMessages([{ role: "examiner", text }]);
        setPhase("ai_speaking");
        speakText(text, {
          onEnd: () => setPhase("listening"),
          rate: 0.9,
        });
      })
      .catch(() => setPhase("idle"));
  }, [currentPart]);

  const handleMicClick = useCallback(async () => {
    if (phase === "ai_speaking" || phase === "processing") return;
    if (isRecording) {
      await stopAndTranscribe();
    } else {
      stopSpeaking();
      setPhase("listening");
      startRecording();
    }
  }, [phase, isRecording, stopAndTranscribe, startRecording]);

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border bg-card p-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-purple/10">
        <span className="text-4xl">🎙️</span>
      </div>
      <h3 className="text-lg font-semibold">AI Speaking Interviewer</h3>

      {phase === "idle" && (
        <>
          <p className="text-center text-sm text-muted-foreground">
            Start the IELTS Speaking test. The AI examiner will ask questions and you respond by speaking.
          </p>
          <Button onClick={startSession} size="lg">
            Start Speaking Test
          </Button>
        </>
      )}

      {(phase === "ai_speaking" || phase === "listening" || phase === "processing") && (
        <>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              {phase === "ai_speaking"
                ? "AI is speaking..."
                : phase === "processing" || isTranscribing
                  ? "Processing..."
                  : "Listening..."}
            </p>
            {phase === "listening" && (
              <WaveVisualizer active={isRecording} className="mt-2" />
            )}
            {phase === "processing" && (
              <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
            )}
          </div>

          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            onClick={handleMicClick}
            disabled={phase === "ai_speaking" || phase === "processing"}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-5 w-5" />
                Stop & Send
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Speak
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="mt-4 max-h-48 w-full overflow-y-auto rounded-lg border bg-muted/30 p-3 text-sm">
            {messages.map((m, i) => (
              <div key={i} className="mb-2">
                <span className="font-medium">{m.role === "examiner" ? "Examiner" : "You"}: </span>
                {m.text}
              </div>
            ))}
          </div>
        </>
      )}

      {phase === "complete" && evaluation && (
        <div className="w-full space-y-4">
          <h4 className="font-semibold">Evaluation</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {["fluency", "lexicalResource", "grammar", "pronunciation"].map((k) => (
              <div key={k} className="rounded-lg border p-2">
                <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}: </span>
                <span className="font-bold">{String((evaluation as Record<string, unknown>)[k] ?? "-")}</span>
              </div>
            ))}
          </div>
          {evaluation.feedback && typeof evaluation.feedback === "object" ? (
            <div className="space-y-2 text-sm">
              {Object.entries(evaluation.feedback as Record<string, string>).map(([k, v]) => (
                <div key={k}>
                  <span className="font-medium capitalize">{k}: </span>
                  {v}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
