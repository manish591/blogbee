import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';

export function Header({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <header
      className={cn('border-b sticky top-0 z-10 bg-background', className)}
    >
      {children}
    </header>
  );
}

export function Navbar({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <nav className={cn('h-16 flex items-center justify-between', className)}>
      {children}
    </nav>
  );
}

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Link href="/" className={cn('text-xl font-bold capitalize', className)}>
      {APP_NAME}
    </Link>
  );
}

export function ProfileAvatar() {
  return (
    <Avatar className="h-6 w-6">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback className="text-sm">CN</AvatarFallback>
    </Avatar>
  );
}

export function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfileAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-sm w-56 mr-[-8px]">
        <DropdownMenuLabel className="px-3">
          <p className="font-medium">manish devrani</p>
          <p className="text-foreground/70 mt-0 font-light">
            manishdevrani777@gmail.com
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm text-foreground/70 px-3">
          <LayoutDashboard />
          All Blogs
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-foreground/70 px-3">
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-foreground/70 px-3">
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-foreground/70 px-3">
          <CircleHelp />
          Feedback
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm text-foreground/70 px-3">
          <LogOut />
          <p>Signout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
