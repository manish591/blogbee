import { ArrowRight, FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants';

export function HeaderSection() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <nav className="max-w-[1080px] h-16 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <span className="text-xl font-bold capitalize">{APP_NAME}</span>
          </Link>
        </div>
        <div className="flex gap-8 items-center font-medium">
          <div className="flex gap-6 items-center">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </span>
            </Link>
            <Link
              href="/blog"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Blog
              </span>
            </Link>
          </div>
          <Link href="/login" className="cursor-pointer">
            <Button
              size="sm"
              variant="secondary"
              className="border shadow-none cursor-pointer text-[0.8rem] h-7"
            >
              <span>Login</span>
              <span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </Button>
          </Link>
          <Link href="/login" className="cursor-pointer hidden">
            <Button
              size="sm"
              variant="default"
              className="border shadow-none cursor-pointer text-[0.8rem] h-7"
            >
              <span>Dashboard</span>
              <span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
