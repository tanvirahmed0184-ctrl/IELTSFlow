import { Metadata } from "next";
import { WritingTestEngine } from "@/components/test-engine/writing-test-engine";

export const metadata: Metadata = {
  title: "Writing Test - IELTS Flow",
  description: "Complete IELTS Writing Task 1 and Task 2 with AI evaluation.",
};

export default function WritingTestPage() {
  // TODO: When backend is connected:
  // 1. Fetch writing prompts from DB (or generate via AI)
  // 2. Create a WritingAttempt record
  // 3. Load any existing drafts if resuming
  // 4. Pass real data to WritingTestEngine

  return <WritingTestEngine />;
}
