import { Metadata } from "next";
import { AIInterviewer } from "@/components/speaking/ai-interviewer/ai-interviewer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Speaking Practice - IELTS Flow",
};

export default function StudentSpeakingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Speaking Practice</h1>
        <p className="mt-1 text-muted-foreground">AI-powered or instructor-led speaking sessions.</p>
      </div>
      <AIInterviewer />
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        <p className="font-medium">Tip: Allow microphone access. The AI examiner will guide you through Parts 1, 2, and 3. Speak clearly for best transcription.</p>
        <Link href="/exam-library/reading" className="mt-2 inline-block text-brand-teal hover:underline">
          ← Back to Exam Library
        </Link>
      </div>
    </div>
  );
}
