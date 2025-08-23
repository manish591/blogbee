'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

// use react query here

export function SignoutButton() {
  return (
    <Button variant="outline" className="text-sm text-foreground/70 px-3">
      <LogOut />
      <p>Signout</p>
    </Button>
  );
}
