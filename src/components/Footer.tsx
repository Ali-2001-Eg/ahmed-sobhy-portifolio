
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 text-center">
      <div className="max-w-7xl mx-auto space-y-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Ahmed Sobhy. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground/50 tracking-widest uppercase">
          <span>Designed & Built with Passion and Precision</span>
          <span>|</span>
          <Link href="/login" className="hover:text-primary transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
