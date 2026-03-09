import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - IELTS Flow Admin",
};

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">User Management</h1>
      <p className="mt-2 text-muted-foreground">Manage students, instructors, and admin accounts.</p>
    </div>
  );
}
