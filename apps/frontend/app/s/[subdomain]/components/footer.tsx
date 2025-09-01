import { Rss } from 'lucide-react';
import Link from 'next/link';
import type { BlogData } from '@/app/blogs/dal/get-all-blogs';
import { DOMAIN_NAME, PROTOCOL } from '@/constants';

export function Footer({ blogData }: Readonly<{ blogData: BlogData }>) {
  return (
    <footer className="bg-secondary/40 border-t py-6">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-medium capitalize">
            {blogData.slug}
          </Link>
          <div className="hidden items-center space-x-4">
            <Link
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <title>Twitter</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <title>Twitter</title>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <title>Twitter</title>
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.897-.875-1.387-2.026-1.387-3.323s.49-2.448 1.297-3.323c.875-.897 2.026-1.387 3.323-1.387s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <title>Twitter</title>
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.341-.09.394-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
              </svg>
            </Link>
            <Link href="#">
              <Rss className="text-foreground/70 hover:text-foreground" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 max-w-7xl px-8 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6 w-full">
          <span className="text-gray-500 text-sm">
            © 2025 <span className="capitalize">{blogData.slug}</span>
          </span>
          <Link
            href="/archive"
            className="text-foreground/70 hover:text-foreground transition-colors text-sm"
          >
            Archive
          </Link>
          <Link
            href={`${PROTOCOL}://${DOMAIN_NAME}/terms-and-conditions`}
            target="_blank"
            className="text-foreground/70 hover:text-foreground transition-colors text-sm"
          >
            Terms
          </Link>
          <Link
            href={`${PROTOCOL}://${DOMAIN_NAME}/privacy-policy`}
            target="_blank"
            className="text-foreground/70 hover:text-foreground transition-colors text-sm"
          >
            Privacy
          </Link>
          <Link
            href={`${PROTOCOL}://${DOMAIN_NAME}`}
            target="_blank"
            className="border inline-block p-[3px] px-2 rounded-md bg-accent/70"
          >
            <p className="text-[0.8rem] text-foreground/70">
              Powered by blogbee
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
