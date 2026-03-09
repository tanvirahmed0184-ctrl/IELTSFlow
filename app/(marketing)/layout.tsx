export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-xl font-bold">IELTS Flow</span>
          <nav className="hidden md:flex gap-6">
            <a href="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</a>
            <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
            <a href="/free-demo" className="text-sm text-muted-foreground hover:text-foreground">Free Demo</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium">Sign In</a>
            <a href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Get Started</a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} IELTS Flow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
