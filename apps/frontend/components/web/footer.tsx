import Link from 'next/link';
import { APP_NAME } from '@/constants';

export function Footer() {
  return (
    <footer className="w-full dark bg-background px-4 py-6 sm:py-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="w-full">
          <div className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-xl font-bold capitalize text-foreground"
                >
                  {APP_NAME}
                </Link>
                <nav className="flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-foreground/70 hover:text-foreground transition-colors text-sm"
                  >
                    Home
                  </Link>
                  <Link
                    href="/blog"
                    className="text-foreground/70 hover:text-foreground transition-colors text-sm"
                  >
                    Blog
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs sm:text-sm text-foreground/40">
            <div>© {APP_NAME} 2025 — All Rights Reserved.</div>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
