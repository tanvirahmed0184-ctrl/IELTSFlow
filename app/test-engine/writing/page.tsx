import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing Test - IELTS Flow",
};

export default function WritingTestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">IELTS Writing Test</h1>
      <p className="mt-2 text-muted-foreground">Complete Task 1 and Task 2 within the allocated time.</p>
    </div>
  );
}
