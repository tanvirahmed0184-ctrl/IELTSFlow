"use client";

interface SidebarProps {
  role: "student" | "instructor" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="hidden w-64 border-r bg-sidebar lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold">IELTS Flow</span>
      </div>
      <nav className="p-4">
        {/* Navigation items based on role */}
      </nav>
    </aside>
  );
}
