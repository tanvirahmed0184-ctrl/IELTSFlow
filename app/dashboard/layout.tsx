import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  Mic,
  BarChart3,
  Settings,
  Calendar,
  Video,
  Users,
  Clock,
  DollarSign,
  Database,
  Sparkles,
  Activity,
  Bell,
  LogOut,
} from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

const studentNav = [
  { href: "/dashboard/student/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/student/practice", label: "Practice", icon: BookOpen },
  { href: "/dashboard/student/tests", label: "My Tests", icon: FileText },
  { href: "/dashboard/student/speaking", label: "Speaking", icon: Mic },
  { href: "/dashboard/student/book", label: "Book Instructor", icon: Calendar },
  { href: "/dashboard/student/bookings", label: "My Bookings", icon: Video },
  { href: "/dashboard/student/progress", label: "Progress", icon: BarChart3 },
  { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
];

const instructorNav = [
  { href: "/dashboard/instructor/availability", label: "Availability", icon: Clock },
  { href: "/dashboard/instructor/sessions", label: "Sessions", icon: Calendar },
  { href: "/dashboard/instructor/evaluations", label: "Evaluations", icon: FileText },
  { href: "/dashboard/instructor/earnings", label: "Earnings", icon: DollarSign },
];

const adminNav = [
  { href: "/dashboard/admin/resources", label: "Resources", icon: Database },
  { href: "/dashboard/admin/test-generator", label: "AI Generator", icon: Sparkles },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: Activity },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

function NavSection({ title, items }: { title: string; items: typeof studentNav }) {
  return (
    <div className="mb-6">
      <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">IELTS Flow</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavSection title="Student" items={studentNav} />
          <NavSection title="Instructor" items={instructorNav} />
          <NavSection title="Admin" items={adminNav} />
        </nav>

        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <MobileNav />
            <h2 className="text-sm font-medium text-muted-foreground hidden sm:inline">
              Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-teal text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-white">
              JD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
