import {
  ArrowRight,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_NAME } from '@/constants';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

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

export function HeaderCTA() {
  const isAuthenticated = false;

  return (
    <>
      {!isAuthenticated ? (
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
      ) : (
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
      )}
    </>
  );
}
