interface FeedbackPanelProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export function FeedbackPanel({ strengths, weaknesses, suggestions }: FeedbackPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h4 className="font-semibold text-green-600">Strengths</h4>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {strengths.map((s, i) => (
            <li key={i} className="text-sm">{s}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h4 className="font-semibold text-red-600">Areas for Improvement</h4>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {weaknesses.map((w, i) => (
            <li key={i} className="text-sm">{w}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h4 className="font-semibold text-blue-600">Suggestions</h4>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i} className="text-sm">{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
