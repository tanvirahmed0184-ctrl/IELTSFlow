import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speaking Test - IELTS Flow",
};

export default function SpeakingTestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">IELTS Speaking Test</h1>
      <p className="mt-2 text-muted-foreground">Complete the speaking test with AI interviewer.</p>
    </div>
  );
}
