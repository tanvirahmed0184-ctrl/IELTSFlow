import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - IELTS Flow",
  description: "Explore all features of IELTS Flow mock test platform.",
};

export default function FeaturesPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center">Practice All 4 Skills</h1>
      <p className="mt-4 text-center text-muted-foreground">Listening, Reading, Writing, and Speaking with AI evaluation.</p>
    </div>
  );
}
