import { Metadata } from "next";
import { SpeakingTestEngine } from "@/components/test-engine/speaking-test-engine";

export const metadata: Metadata = {
  title: "Speaking Test - IELTS Flow",
  description: "Take an AI-powered IELTS Speaking mock test with real-time voice interaction.",
};

export default function SpeakingTestPage() {
  return <SpeakingTestEngine />;
}
