import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listening Test - IELTS Flow",
};

export default function ListeningTestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">IELTS Listening Test</h1>
      <p className="mt-2 text-muted-foreground">Complete the listening test within the allocated time.</p>
    </div>
  );
}
