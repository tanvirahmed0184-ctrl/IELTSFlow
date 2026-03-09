import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - IELTS Flow",
};

export default function RegisterPage() {
  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Start your IELTS preparation journey</p>
    </div>
  );
}
