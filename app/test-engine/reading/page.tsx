import { Suspense } from "react";
import { ReadingTestEngine } from "@/components/test-engine/reading-test-engine";

export const metadata = {
  title: "Reading Test - IELTS Flow",
  description: "IELTS Reading practice with split-pane passage and questions",
};

export default function ReadingTestPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <ReadingTestEngine />
    </Suspense>
  );
}
