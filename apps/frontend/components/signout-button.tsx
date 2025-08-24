'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signoutUser } from '@/app/(auth)/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SignoutButton({ className }: Readonly<{ className?: string }>) {
  const router = useRouter();

  async function handleSignoutUser() {
    try {
      await signoutUser();
      console.log('SIGNOUT_SUCCESS: Successfully signout user');
      router.refresh();
    } catch (err) {
      console.log('SIGNOUT_ERROR: Failed to signout user', err);
    }
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full text-sm text-foreground/70 px-0 justify-start',
        className,
      )}
      onClick={handleSignoutUser}
    >
      <LogOut />
      <p>Signout</p>
    </Button>
  );
}
