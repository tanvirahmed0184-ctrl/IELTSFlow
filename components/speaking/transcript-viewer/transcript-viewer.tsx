interface TranscriptViewerProps {
  transcript: { speaker: string; text: string; timestamp: number }[];
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Transcript</h3>
      <div className="space-y-4">
        {transcript.map((entry, index) => (
          <div key={index} className="flex gap-3">
            <span className="text-xs font-medium text-muted-foreground w-20 shrink-0">
              {entry.speaker}
            </span>
            <p className="text-sm">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
