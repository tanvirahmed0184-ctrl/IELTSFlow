import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          IELTS Flow
        </Link>
        <nav className="hidden md:flex gap-6">
          {/* Navigation links */}
        </nav>
      </div>
    </header>
  );
}
