import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - IELTS Flow",
  description: "See our packages for IELTS practice and mock tests.",
};

export default function PricingPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center">See Our Packages</h1>
      <p className="mt-4 text-center text-muted-foreground">Choose a plan that fits your preparation needs.</p>
    </div>
  );
}
