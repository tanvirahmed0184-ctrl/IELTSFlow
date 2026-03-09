import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - IELTS Flow",
};

export default function StudentOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome back! Here is your progress overview.</p>
    </div>
  );
}
