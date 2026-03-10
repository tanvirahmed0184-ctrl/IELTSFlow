import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - IELTS Flow",
  description: "See our packages for IELTS practice and mock tests.",
};

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Get started with basic practice tests.",
    features: [
      "2 practice tests per module",
      "Basic AI evaluation",
      "Band score overview",
      "Community support",
    ],
    cta: "Start Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "month",
    description: "Full access for serious IELTS preparation.",
    features: [
      "Unlimited practice tests",
      "Full AI evaluation with feedback",
      "Detailed per-criterion scores",
      "Progress tracking & analytics",
      "Writing sample rewrites",
      "AI speaking interviews",
    ],
    cta: "Start Pro Trial",
    href: "/checkout",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "39",
    period: "month",
    description: "Everything in Pro plus live instructor sessions.",
    features: [
      "Everything in Pro",
      "4 live speaking sessions/month",
      "Instructor vs AI score comparison",
      "Priority support",
      "Personalized study plan",
      "Full mock test simulations",
    ],
    cta: "Go Premium",
    href: "/checkout",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold">See Our Packages</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that fits your IELTS preparation needs.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-7 transition-all hover:-translate-y-1 ${
              plan.highlighted
                ? "border-brand-teal bg-brand-teal/5 ring-2 ring-brand-teal"
                : "border-border bg-card"
            }`}
          >
            {plan.highlighted && (
              <div className="mb-4 inline-flex rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">/{plan.period}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-brand-teal" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                plan.highlighted
                  ? "bg-brand-teal text-white hover:bg-brand-teal-dark"
                  : "border bg-background hover:bg-muted"
              }`}
            >
              {plan.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
