"use client";

interface FillInBlankProps {
  questionId: string;
  question: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export function FillInBlank({ questionId, question, onAnswer }: FillInBlankProps) {
  return (
    <div className="space-y-4">
      <p className="font-medium">{question}</p>
      <input
        type="text"
        placeholder="Type your answer..."
        onChange={(e) => onAnswer(questionId, e.target.value)}
        className="w-full rounded-lg border px-4 py-2"
      />
    </div>
  );
}
