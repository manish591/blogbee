import { CircleHelp, LayoutDashboard, Settings, UserIcon } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@/app/(auth)/dal/verify-session';
import { ProfileAvatar } from '@/components/web/profile-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutButton } from './signout-button';

export function ProfileDropdown({ user }: Readonly<{ user: User }>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <ProfileAvatar
          profileImg={user.profileImg}
          profileName={user.name}
          className="w-8 h-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-sm w-56 mr-[-8px]">
        <DropdownMenuLabel className="px-3">
          <p className="font-medium">{user.name}</p>
          <p className="text-foreground/70 mt-0 font-light">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-sm text-foreground/70 px-3 cursor-pointer"
          asChild
        >
          <Link href="/blogs/all">
            <LayoutDashboard />
            All Blogs
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm text-foreground/70 px-3 cursor-pointer"
          asChild
        >
          <Link href="/account/profile">
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm text-foreground/70 px-3 cursor-pointer"
          asChild
        >
          <Link href="/account/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm text-foreground/70 px-3 cursor-pointer"
          asChild
        >
          <Link href="mailto:manishdevrani777@gmail.com">
            <CircleHelp />
            Feedback
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
