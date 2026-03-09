import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - IELTS Flow",
};

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Enter your email to reset your password</p>
    </div>
  );
}
