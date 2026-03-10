import { Suspense } from "react";
import { ListeningTestEngine } from "@/components/test-engine/listening-test-engine";

export const metadata = {
  title: "Listening Test - IELTS Flow",
  description: "IELTS Listening practice with audio player and timed review",
};

export default function ListeningTestPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <ListeningTestEngine />
    </Suspense>
  );
}
