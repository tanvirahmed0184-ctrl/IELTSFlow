interface ScoreDisplayProps {
  overallBand: number;
  criteria?: { name: string; score: number }[];
}

export function ScoreDisplay({ overallBand, criteria }: ScoreDisplayProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold">Predicted Band Score</h3>
      <div className="mt-4 text-center">
        <span className="text-5xl font-bold">{overallBand}</span>
      </div>
      {criteria && (
        <div className="mt-6 space-y-2">
          {criteria.map((c) => (
            <div key={c.name} className="flex justify-between">
              <span className="text-sm text-muted-foreground">{c.name}</span>
              <span className="font-medium">{c.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
