import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - IELTS Flow Admin",
};

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="mt-2 text-muted-foreground">Platform usage, performance, and insights.</p>
    </div>
  );
}
