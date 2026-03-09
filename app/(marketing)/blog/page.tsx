import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - IELTS Flow",
  description: "IELTS tips, strategies, and preparation guides.",
};

export default function BlogPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center">Blog</h1>
      <p className="mt-4 text-center text-muted-foreground">IELTS tips, strategies, and preparation guides.</p>
    </div>
  );
}
