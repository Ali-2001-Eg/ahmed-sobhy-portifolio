export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 text-center">
      <div className="max-w-7xl mx-auto space-y-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Ahmed Sobhy. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/50 tracking-widest uppercase">
          Designed & Built with Passion and Precision
        </p>
      </div>
    </footer>
  );
}
