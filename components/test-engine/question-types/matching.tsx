"use client";

interface MatchingProps {
  questionId: string;
  items: { left: string; right: string }[];
  onAnswer: (questionId: string, answer: Record<string, string>) => void;
}

export function Matching({ questionId, items, onAnswer }: MatchingProps) {
  return (
    <div className="space-y-4">
      <p className="font-medium">Match the items</p>
      {/* Matching interface */}
    </div>
  );
}
