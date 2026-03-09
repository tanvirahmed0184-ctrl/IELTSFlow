import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tests - IELTS Flow",
};

export default function StudentTestsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">My Tests</h1>
      <p className="mt-2 text-muted-foreground">View your test history and results.</p>
    </div>
  );
}
