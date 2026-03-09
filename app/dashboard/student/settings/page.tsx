import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - IELTS Flow",
};

export default function StudentSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">Manage your account settings and preferences.</p>
    </div>
  );
}
