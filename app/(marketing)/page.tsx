import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IELTS Flow - AI-Powered IELTS Mock Test Platform",
  description: "Practice IELTS Reading, Listening, Writing, and Speaking with AI-predicted band scores. Take full mock tests and track your progress.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Free IELTS Preparation with <span className="text-primary">Mock Test IELTS</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Practice all 4 skills with AI-powered evaluation and predicted band scores.
        </p>
      </section>
    </div>
  );
}
