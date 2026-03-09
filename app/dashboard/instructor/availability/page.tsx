import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Availability - IELTS Flow Instructor",
};

export default function InstructorAvailabilityPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Manage Availability</h1>
      <p className="mt-2 text-muted-foreground">Set your available time slots for speaking sessions.</p>
    </div>
  );
}
