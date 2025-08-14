import { FileText } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b">
      <nav className="max-w-[1080px] px-4 h-16 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center rounded-md">
            <FileText className="h-5 w-5 rotate-6" />
          </div>
          <span className="text-xl font-bold">Writely</span>
        </div>
        <div className="flex gap-6 font-medium">
          <Link
            href="#"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="#"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Changelog
          </Link>
          <Link
            href="#"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Developers
          </Link>
          <Link
            href="#"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </div>
      </nav>
    </header>
  );
}
