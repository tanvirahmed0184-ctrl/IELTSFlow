import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources - IELTS Flow Admin",
};

export default function AdminResourcesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Resource Management</h1>
      <p className="mt-2 text-muted-foreground">Upload and manage IELTS materials for AI content generation.</p>
    </div>
  );
}
