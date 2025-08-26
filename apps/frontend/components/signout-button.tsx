'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/app/(auth)/actions/logout-user';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LogoutButton({ className }: Readonly<{ className?: string }>) {
  const router = useRouter();

  async function handleLogoutUser() {
    try {
      await logoutUser();
      console.log('LOGOUT_SUCCESS: Successfully logout user');
      router.refresh();
    } catch (err) {
      console.log('LOGOUT_ERROR: Failed to logout user', err);
    }
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full text-sm text-foreground/70 px-0 justify-start',
        className,
      )}
      onClick={handleLogoutUser}
    >
      <LogOut />
      <p>Logout</p>
    </Button>
  );
}
