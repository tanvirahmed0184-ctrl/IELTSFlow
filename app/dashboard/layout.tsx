export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-sidebar lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-bold">IELTS Flow</span>
        </div>
        <nav className="p-4">
          {/* Sidebar navigation - to be built */}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b px-6">
          {/* Top bar - to be built */}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
