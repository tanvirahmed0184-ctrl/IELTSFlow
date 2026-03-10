"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { GraduationCap } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    billingAddress: "",
    city: "",
    postalCode: "",
    country: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "checkout",
          billingData: form,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/student/overview"), 2000);
      } else {
        const data = await res.json();
        alert(data.error ?? "Checkout failed");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
        <div className="rounded-xl border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold">Checkout submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Billing data saved. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8">
        <Link href="/pricing" className="text-sm text-muted-foreground hover:underline">
          ← Back to Pricing
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Enter your billing details. Payment gateway integration coming soon.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Your data will be stored securely. No actual charges until payment is enabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <Input
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Card Number</label>
              <Input
                value={form.cardNumber}
                onChange={(e) => setForm((p) => ({ ...p, cardNumber: e.target.value }))}
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Exp Month</label>
                <Input
                  value={form.expMonth}
                  onChange={(e) => setForm((p) => ({ ...p, expMonth: e.target.value }))}
                  placeholder="12"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Exp Year</label>
                <Input
                  value={form.expYear}
                  onChange={(e) => setForm((p) => ({ ...p, expYear: e.target.value }))}
                  placeholder="2026"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">CVV</label>
                <Input
                  value={form.cvv}
                  onChange={(e) => setForm((p) => ({ ...p, cvv: e.target.value }))}
                  placeholder="123"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Billing Address</label>
              <Input
                value={form.billingAddress}
                onChange={(e) => setForm((p) => ({ ...p, billingAddress: e.target.value }))}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">City</label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Postal Code</label>
                <Input
                  value={form.postalCode}
                  onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
                  placeholder="10001"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Country</label>
              <Input
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                placeholder="United States"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing…" : "Complete Checkout"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
