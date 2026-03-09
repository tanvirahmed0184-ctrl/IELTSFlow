import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Headphones,
  Mic,
  PenLine,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="bg-brand-purple-dark text-white text-xs py-1.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> support@ieltsflow.com
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone className="h-3 w-3" /> +1 (800) 123-4567
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#" aria-label="Facebook"><Facebook className="h-3.5 w-3.5" /></Link>
            <Link href="#" aria-label="Twitter"><Twitter className="h-3.5 w-3.5" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-3.5 w-3.5" /></Link>
            <Link href="#" aria-label="YouTube"><Youtube className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-brand-purple via-brand-purple-light to-brand-purple shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">IELTS Flow</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/free-demo", label: "Practice Test" },
              { href: "/free-demo", label: "Mock Test" },
              { href: "/test-engine/speaking", label: "Speaking" },
              { href: "/blog", label: "IELTS Tips" },
              { href: "/features", label: "Study Material" },
              { href: "/pricing", label: "Pricing" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-md px-4 py-2 text-sm font-medium text-white border border-white/30 transition-colors hover:bg-white/15"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex rounded-md bg-brand-teal px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-teal-dark"
            >
              Get Started Free
            </Link>
            <button className="lg:hidden text-white p-1" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">IELTS Flow</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                AI-powered IELTS preparation platform with mock tests, band score prediction, and personalized study plans.
              </p>
              <div className="mt-5 flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-brand-purple"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Practice Tests */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Practice Tests</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { icon: Headphones, label: "Listening Practice", href: "/test-engine/listening" },
                  { icon: BookOpen, label: "Reading Practice", href: "/test-engine/reading" },
                  { icon: PenLine, label: "Writing Practice", href: "/test-engine/writing" },
                  { icon: Mic, label: "Speaking Practice", href: "/test-engine/speaking" },
                  { icon: GraduationCap, label: "Full Mock Test", href: "/free-demo" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="flex items-center gap-2 text-slate-400 transition-colors hover:text-brand-teal">
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Features", href: "/features" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Blog & Tips", href: "/blog" },
                  { label: "Contact", href: "/contact" },
                  { label: "FAQ", href: "/features#faq" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-slate-400 transition-colors hover:text-brand-teal">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5 text-slate-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-teal" />
                  123 Education Lane, Learning City, ED 12345
                </li>
                <li className="flex items-center gap-2.5 text-slate-400">
                  <Mail className="h-4 w-4 shrink-0 text-brand-teal" />
                  support@ieltsflow.com
                </li>
                <li className="flex items-center gap-2.5 text-slate-400">
                  <Phone className="h-4 w-4 shrink-0 text-brand-teal" />
                  +1 (800) 123-4567
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} IELTS Flow. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
              <Link href="#" className="hover:text-slate-300">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
