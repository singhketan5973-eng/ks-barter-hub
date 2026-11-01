export function Footer() {
  return (
    <footer className="border-line mt-16 border-t">
      <div className="max-w-page text-foreground-muted mx-auto w-full px-6 py-8 text-sm">
        <p>© {new Date().getFullYear()} Barter Hub. Swap things and skills with people near you.</p>
      </div>
    </footer>
  );
}
