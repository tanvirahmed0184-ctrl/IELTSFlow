import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speaking Practice - IELTS Flow",
};

export default function StudentSpeakingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Speaking Practice</h1>
      <p className="mt-2 text-muted-foreground">AI-powered or instructor-led speaking sessions.</p>
    </div>
  );
}
