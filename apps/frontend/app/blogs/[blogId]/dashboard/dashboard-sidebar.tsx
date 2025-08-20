import {
  ExternalLink,
  LayoutDashboard,
  NotepadText,
  Settings,
  Tags,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  return (
    <aside className="h-[calc(100svh-70px)] bg-background border-r overflow-auto py-4 flex flex-col">
      <div className="px-6">
        <p className="uppercase text-sm">Blog Dashboard</p>
      </div>
      <DashboardSidebarLinkGroup>
        <DashboardSidebarLink>
          <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
          <span>Overview</span>
        </DashboardSidebarLink>
        <DashboardSidebarLink>
          <Settings className="w-4 h-4" strokeWidth={2} />
          <span>General</span>
        </DashboardSidebarLink>
      </DashboardSidebarLinkGroup>
      <DashboardSidebarSeparator />
      <DashboardSidebarLinkGroup>
        <DashboardSidebarLink>
          <NotepadText className="w-4 h-4" strokeWidth={2} />
          <span>Posts & Drafts</span>
        </DashboardSidebarLink>
        <DashboardSidebarLink>
          <Tags className="w-4 h-4" strokeWidth={2} />
          <span>Categories</span>
        </DashboardSidebarLink>
      </DashboardSidebarLinkGroup>
      <div className="mt-auto px-6">
        <Button
          variant="outline"
          className="w-full h-10 text-foreground/70 gap-3"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Visit Blog</span>
        </Button>
      </div>
    </aside>
  );
}

export function DashboardSidebarLinkGroup({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div className={cn('pl-4 px-4 mt-4 space-y-1', className)}>{children}</div>
  );
}

export function DashboardSidebarSeparator({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn('h-[1px] w-[90%] mx-auto mt-3 bg-border', className)} />
  );
}

export function DashboardSidebarLink({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <Link
      href="#"
      className={cn(
        'text-foreground/60 flex items-center gap-2 hover:bg-secondary transition-colors p-1.5 px-2 rounded-md',
        className,
      )}
    >
      {children}
    </Link>
  );
}
