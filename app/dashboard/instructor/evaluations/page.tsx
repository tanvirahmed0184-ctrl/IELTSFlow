import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evaluations - IELTS Flow Instructor",
};

export default function InstructorEvaluationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Evaluations</h1>
      <p className="mt-2 text-muted-foreground">Review and score student speaking performances.</p>
    </div>
  );
}
