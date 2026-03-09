import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings - IELTS Flow Instructor",
};

export default function InstructorEarningsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Earnings</h1>
      <p className="mt-2 text-muted-foreground">Track your earnings from speaking sessions.</p>
    </div>
  );
}
