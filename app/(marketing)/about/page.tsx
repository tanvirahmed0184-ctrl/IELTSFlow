import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - IELTS Flow",
  description: "Learn about IELTS Flow and our mission.",
};

export default function AboutPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center">About IELTS Flow</h1>
      <p className="mt-4 text-center text-muted-foreground">Our mission is to make IELTS preparation accessible and effective.</p>
    </div>
  );
}
