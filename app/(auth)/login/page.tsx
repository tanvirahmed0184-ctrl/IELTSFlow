"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, User, Shield, BookOpen } from "lucide-react";
import type { UserRole } from "@/app/generated/prisma/enums";

type LoginRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

const ROLE_OPTIONS: { value: LoginRole; label: string; icon: typeof User }[] = [
  { value: "STUDENT", label: "Student", icon: BookOpen },
  { value: "INSTRUCTOR", label: "Instructor", icon: User },
  { value: "ADMIN", label: "Admin", icon: Shield },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<LoginRole>("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message ?? "Invalid email or password");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Sign in failed. Please try again.");
        setLoading(false);
        return;
      }

      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (meData.needsSync) {
        await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        });
      }

      const retryMe = await fetch("/api/auth/me");
      const { user } = await retryMe.json();

      if (!user) {
        setError("Your account is being set up. Please try again in a moment.");
        setLoading(false);
        return;
      }

      const dbRole = user.role as UserRole;
      const allowedRoles: UserRole[] = ["STUDENT", "INSTRUCTOR", "ADMIN", "SUPER_ADMIN"];

      if (selectedRole === "ADMIN" && dbRole !== "ADMIN" && dbRole !== "SUPER_ADMIN") {
        setError("You don't have admin access. Sign in as Student or Instructor.");
        setLoading(false);
        return;
      }
      if (selectedRole === "INSTRUCTOR" && dbRole !== "INSTRUCTOR") {
        setError("You don't have instructor access. Sign in as Student or Admin.");
        setLoading(false);
        return;
      }
      if (selectedRole === "STUDENT" && !["STUDENT", "GUEST"].includes(dbRole)) {
        setError("Sign in with the correct account type.");
        setLoading(false);
        return;
      }

      if (dbRole === "ADMIN" || dbRole === "SUPER_ADMIN") {
        router.push("/dashboard/admin/analytics");
      } else if (dbRole === "INSTRUCTOR") {
        router.push("/dashboard/instructor/availability");
      } else {
        if (user.profile?.onboardingCompleted) {
          router.push("/dashboard/student/overview");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <CardTitle className="text-2xl">Sign In</CardTitle>
        </div>
        <CardDescription>Welcome back to IELTS Flow</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">I am a</label>
            <div className="flex gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedRole(opt.value)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    selectedRole === opt.value
                      ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                      : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-10"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-10"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-brand-purple hover:underline">
              Sign up
            </Link>
          </p>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
