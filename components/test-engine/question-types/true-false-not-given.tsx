"use client";

interface TrueFalseNotGivenProps {
  questionId: string;
  statement: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export function TrueFalseNotGiven({ questionId, statement, onAnswer }: TrueFalseNotGivenProps) {
  return (
    <div className="space-y-4">
      <p className="font-medium">{statement}</p>
      <div className="flex gap-4">
        {["True", "False", "Not Given"].map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(questionId, option)}
            className="rounded-lg border px-4 py-2 hover:bg-muted"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
