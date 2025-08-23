import { APP_NAME } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Link href="/" className={cn('text-xl font-bold capitalize', className)}>
      {APP_NAME}
    </Link>
  );
}
