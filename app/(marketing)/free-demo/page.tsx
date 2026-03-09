import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Demo - IELTS Flow",
  description: "Try a free IELTS mock test demo.",
};

export default function FreeDemoPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center">Free Demo</h1>
      <p className="mt-4 text-center text-muted-foreground">Try a sample IELTS mock test for free.</p>
    </div>
  );
}
