export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} IELTS Flow. All rights reserved.
      </div>
    </footer>
  );
}
