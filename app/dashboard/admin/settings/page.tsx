import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - IELTS Flow Admin",
};

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Platform Settings</h1>
      <p className="mt-2 text-muted-foreground">Configure platform-wide settings.</p>
    </div>
  );
}
