"use client";

interface SpeechRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export function SpeechRecorder({ onRecordingComplete }: SpeechRecorderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
        {/* Mic icon */}
      </button>
      <span className="text-sm text-muted-foreground">Click to start recording</span>
    </div>
  );
}
