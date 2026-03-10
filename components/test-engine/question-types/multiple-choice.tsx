"use client";

interface MultipleChoiceProps {
  questionId: string;
  question: string;
  options: string[];
  value?: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export function MultipleChoice({ questionId, question, options, value, onAnswer }: MultipleChoiceProps) {
  return (
    <div className="space-y-4">
      <p className="font-medium">{question}</p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <label key={index} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted">
            <input
              type="radio"
              name={questionId}
              value={option}
              checked={value === option}
              onChange={() => onAnswer(questionId, option)}
              className="h-4 w-4"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
