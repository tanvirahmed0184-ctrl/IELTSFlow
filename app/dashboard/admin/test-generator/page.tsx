import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Generator - IELTS Flow Admin",
};

export default function AdminTestGeneratorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">AI Test Generator</h1>
      <p className="mt-2 text-muted-foreground">Generate new mock tests and practice materials using AI.</p>
    </div>
  );
}
