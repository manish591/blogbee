import { cn } from '@/lib/utils';

export function Header({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <header
      className={cn('border-b sticky top-0 z-10 bg-background', className)}
    >
      {children}
    </header>
  );
}
