import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions - IELTS Flow Instructor",
};

export default function InstructorSessionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Sessions</h1>
      <p className="mt-2 text-muted-foreground">View upcoming and past speaking sessions.</p>
    </div>
  );
}
