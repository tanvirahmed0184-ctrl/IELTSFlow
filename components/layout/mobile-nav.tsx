\"use client\";

import { useEffect, useState } from \"react\";
import Link from \"next/link\";
import { useRouter } from \"next/navigation\";
import { Menu, X, Home, LayoutDashboard, BookOpen, Headphones, PenLine, Mic, CreditCard, Calendar } from \"lucide-react\";
import { createSupabaseBrowserClient } from \"@/lib/supabase/client\";

const navItems = [
  { href: \"/\", label: \"Home\", icon: Home },
  { href: \"/dashboard/student/overview\", label: \"Student Dashboard\", icon: LayoutDashboard },
  { href: \"/exam-library/listening\", label: \"Listening Tests\", icon: Headphones },
  { href: \"/exam-library/reading\", label: \"Reading Tests\", icon: BookOpen },
  { href: \"/exam-library/writing\", label: \"Writing Tests\", icon: PenLine },
  { href: \"/dashboard/student/speaking\", label: \"Speaking (AI & Live)\", icon: Mic },
  { href: \"/pricing\", label: \"Pricing\", icon: CreditCard },
  {
    href: \"https://www.britishcouncil.org/exam/ielts/dates-fees-locations\",
    label: \"BC Exam Dates (Official)\",
    icon: Calendar,
    external: true,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch(\"/api/auth/me\");
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;
        setLoggedIn(Boolean(data?.user));
      } catch {
        if (!isMounted) return;
        setLoggedIn(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSignOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(\"[mobile-nav] sign out failed\", e);
    } finally {
      setOpen(false);
      router.push(\"/\");
    }
  }

  return (
    <div className=\"lg:hidden\">
      <button
        type=\"button\"
        aria-label=\"Open navigation menu\"
        className=\"inline-flex items-center justify-center rounded-md p-2 text-current hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring/50\"
        onClick={() => setOpen(true)}
      >
        <Menu className=\"h-6 w-6\" />
      </button>

      {open && (
        <div className=\"fixed inset-0 z-50 bg-black/40\" onClick={() => setOpen(false)}>
          <div
            className=\"absolute inset-y-0 right-0 flex w-72 max-w-full flex-col bg-background shadow-xl\"
            onClick={(e) => e.stopPropagation()}
          >
            <div className=\"flex items-center justify-between border-b px-4 py-3\">
              <span className=\"text-sm font-semibold\">IELTS Flow</span>
              <button
                type=\"button\"
                aria-label=\"Close navigation menu\"
                className=\"inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted\"
                onClick={() => setOpen(false)}
              >
                <X className=\"h-5 w-5\" />
              </button>
            </div>

            <nav className=\"flex-1 overflow-y-auto px-2 py-3 space-y-1\">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  {...(item.external ? { target: \"_blank\", rel: \"noreferrer\" } : {})}
                  className=\"flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground\"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className=\"h-4 w-4\" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className=\"border-t px-4 py-3 flex gap-2\">
              {loggedIn ? (
                <>
                  <Link
                    href=\"/dashboard/student/overview\"
                    className=\"flex-1 rounded-md border px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted\"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type=\"button\"
                    className=\"flex-1 rounded-md bg-brand-teal px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-teal-dark\"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href=\"/login\"
                    className=\"flex-1 rounded-md border px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted\"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href=\"/register\"
                    className=\"flex-1 rounded-md bg-brand-teal px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-teal-dark\"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
