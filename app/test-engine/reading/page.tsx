import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Test - IELTS Flow",
};

export default function ReadingTestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">IELTS Reading Test</h1>
      <p className="mt-2 text-muted-foreground">Read the passages and answer the questions.</p>
    </div>
  );
}
