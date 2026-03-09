import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress - IELTS Flow",
};

export default function StudentProgressPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Progress Tracking</h1>
      <p className="mt-2 text-muted-foreground">Track your improvement across all IELTS skills.</p>
    </div>
  );
}
