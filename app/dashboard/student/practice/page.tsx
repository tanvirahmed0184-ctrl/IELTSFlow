import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice - IELTS Flow",
};

export default function StudentPracticePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Practice</h1>
      <p className="mt-2 text-muted-foreground">Choose a skill to practice.</p>
    </div>
  );
}
