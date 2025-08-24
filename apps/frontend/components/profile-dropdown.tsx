import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, UserIcon, Settings, CircleHelp } from 'lucide-react';
import { ProfileAvatar } from '@/components/profile-avatar';
import type { User } from '@/lib/dal';
import Link from 'next/link';
import { SignoutButton } from '@/components/signout-button';

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
          <Link href="#">
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm text-foreground/70 px-3 cursor-pointer"
          asChild
        >
          <Link href="#">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm text-foreground/70 px-3 cursor-pointer"
          asChild
        >
          <Link href="#">
            <CircleHelp />
            Feedback
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <SignoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
