'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function BackButton({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className={cn('cursor-pointer', className)}
      onClick={() => {
        router.back();
      }}
    >
      {children}
    </Button>
  );
}
