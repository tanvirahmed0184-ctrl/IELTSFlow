import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - IELTS Flow",
};

export default function LoginPage() {
  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center">Sign In</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Welcome back to IELTS Flow</p>
    </div>
  );
}
