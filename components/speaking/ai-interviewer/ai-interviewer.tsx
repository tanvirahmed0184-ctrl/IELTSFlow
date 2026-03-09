"use client";

export function AIInterviewer() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border bg-card p-8">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-3xl">🎙️</span>
      </div>
      <h3 className="text-lg font-semibold">AI Speaking Interviewer</h3>
      <p className="text-sm text-muted-foreground text-center">
        Your AI interviewer will guide you through the IELTS speaking test.
      </p>
    </div>
  );
}
